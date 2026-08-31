import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 1. Отримання поточної статистики (Query)
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const statsDoc = await ctx.db.query("stats").first();

    // Якщо в базі ще немає запису — повертаємо початкові нулі
    if (!statsDoc) {
      return {
        totalGames: 0,
        winsX: 0,
        winsO: 0,
        draws: 0,
      };
    }

    return {
      totalGames: statsDoc.totalGames,
      winsX: statsDoc.winsX,
      winsO: statsDoc.winsO,
      draws: statsDoc.draws,
    };
  },
});

// 2. Запис результату завершеної гри (Mutation)
export const recordGameResult = mutation({
  args: {
    result: v.union(v.literal("X"), v.literal("O"), v.literal("DRAW")),
  },
  handler: async (ctx, args) => {
    const statsDoc = await ctx.db.query("stats").first();

    if (!statsDoc) {
      // Якщо це перша партія — створюємо початковий запис
      await ctx.db.insert("stats", {
        totalGames: 1,
        winsX: args.result === "X" ? 1 : 0,
        winsO: args.result === "O" ? 1 : 0,
        draws: args.result === "DRAW" ? 1 : 0,
        updatedAt: Date.now(),
      });
    } else {
      // Атомарно оновлюємо існуючий запис
      await ctx.db.patch(statsDoc._id, {
        totalGames: statsDoc.totalGames + 1,
        winsX: args.result === "X" ? statsDoc.winsX + 1 : statsDoc.winsX,
        winsO: args.result === "O" ? statsDoc.winsO + 1 : statsDoc.winsO,
        draws: args.result === "DRAW" ? statsDoc.draws + 1 : statsDoc.draws,
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// 3. Скидання всієї статистики (Mutation)
export const resetStats = mutation({
  args: {},
  handler: async (ctx) => {
    const allStats = await ctx.db.query("stats").collect();
    for (const item of allStats) {
      await ctx.db.delete(item._id);
    }

    // Створюємо чистий запис із нулями
    await ctx.db.insert("stats", {
      totalGames: 0,
      winsX: 0,
      winsO: 0,
      draws: 0,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});
