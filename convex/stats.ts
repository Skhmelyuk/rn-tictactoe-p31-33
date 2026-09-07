import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";

// 1. Отримання статистики поточного гравця
export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }

    return await ctx.db
      .query("stats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

// 2. Скидання статистики поточного гравця
export const resetStats = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new ConvexError("Не авторизовано");
    }

    const userStats = await ctx.db
      .query("stats")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (userStats) {
      await ctx.db.patch(userStats._id, {
        totalGames: 0,
        winsX: 0,
        winsO: 0,
        draws: 0,
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});