import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 1. Запис результату гри з прив'язкою до гравця
export const recordGame = mutation({
  args: {
    winner: v.union(v.literal("X"), v.literal("O"), v.literal("DRAW")),
    board: v.array(v.union(v.string(), v.null())),
    winningCombination: v.optional(v.array(v.number())),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Користувач не авторизований");
    }

    // 1.1 Додаємо партію в таблицю games для поточного userId
    const gameId = await ctx.db.insert("games", {
      userId,
      winner: args.winner,
      board: args.board,
      winningCombination: args.winningCombination,
      createdAt: Date.now(),
    });

    // 1.2 Оновлюємо персональну статистику гравця
    const userStats = await ctx.db
      .query("stats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (!userStats) {
      await ctx.db.insert("stats", {
        userId,
        totalGames: 1,
        winsX: args.winner === "X" ? 1 : 0,
        winsO: args.winner === "O" ? 1 : 0,
        draws: args.winner === "DRAW" ? 1 : 0,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.patch(userStats._id, {
        totalGames: userStats.totalGames + 1,
        winsX:
          args.winner === "X" ? userStats.winsX + 1 : userStats.winsX,
        winsO:
          args.winner === "O" ? userStats.winsO + 1 : userStats.winsO,
        draws:
          args.winner === "DRAW" ? userStats.draws + 1 : userStats.draws,
        updatedAt: Date.now(),
      });
    }

    return gameId;
  },
});

// 2. Отримання останніх ігор ТІЛЬКИ поточного гравця
export const getRecentGames = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return [];
    }

    return await ctx.db
      .query("games")
      .withIndex("by_user_creation", (q) => q.eq("userId", userId))
      .order("desc")
      .take(20);
  },
});

// 3. Видалення окремого запису гри гравця
export const deleteGame = mutation({
  args: {
    id: v.id("games"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Не авторизовано");
    }

    const game = await ctx.db.get(args.id);
    if (!game) {
      throw new ConvexError("Гру не знайдено");
    }

    // Перевірка прав доступу: гра повинна належати саме цьому гравцю
    if (game.userId !== userId) {
      throw new ConvexError("Немає прав на видалення цього запису");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// 4. Повне очищення історії ігор поточного гравця
export const clearAllGames = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Не авторизовано");
    }

    const userGames = await ctx.db
      .query("games")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const game of userGames) {
      await ctx.db.delete(game._id);
    }

    return { deletedCount: userGames.length };
  },
});