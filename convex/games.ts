import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 1. Запис завершеної партії в історію + оновлення лічильників у stats
export const recordGame = mutation({
  args: {
    winner: v.union(v.literal("X"), v.literal("O"), v.literal("DRAW")),
    board: v.array(v.union(v.string(), v.null())),
    winningCombination: v.optional(v.array(v.number())),
  },
  handler: async (ctx, args) => {
    // 1.1. Додаємо партію в таблицю games
    const gameId = await ctx.db.insert("games", {
      winner: args.winner,
      board: args.board,
      winningCombination: args.winningCombination,
      createdAt: Date.now(),
    });

    // 1.2. Оновлюємо таблицю stats в тій же транзакції
    const currentStats = await ctx.db.query("stats").first();

    if (!currentStats) {
      await ctx.db.insert("stats", {
        totalGames: 1,
        winsX: args.winner === "X" ? 1 : 0,
        winsO: args.winner === "O" ? 1 : 0,
        draws: args.winner === "DRAW" ? 1 : 0,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.patch(currentStats._id, {
        totalGames: currentStats.totalGames + 1,
        winsX:
          args.winner === "X" ? currentStats.winsX + 1 : currentStats.winsX,
        winsO:
          args.winner === "O" ? currentStats.winsO + 1 : currentStats.winsO,
        draws:
          args.winner === "DRAW" ? currentStats.draws + 1 : currentStats.draws,
        updatedAt: Date.now(),
      });
    }

    return gameId;
  },
});

// 2. Отримання списку останніх 30 партій (Query)
export const getRecentGames = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("games")
      .withIndex("by_creation")
      .order("desc")
      .take(30);
  },
});

// 3. Видалення окремого запису гри (Mutation)
export const deleteGame = mutation({
  args: {
    id: v.id("games"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// 4. Повне очищення історії ігор (Mutation)
export const clearAllGames = mutation({
  args: {},
  handler: async (ctx) => {
    const allGames = await ctx.db.query("games").collect();
    for (const game of allGames) {
      await ctx.db.delete(game._id);
    }
    return { deletedCount: allGames.length };
  },
});
