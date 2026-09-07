import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 1. Таблиці автентифікації (користувачі, сесії, токени)
  ...authTables,

  // 2. Персональна статистика гравця
  stats: defineTable({
    userId: v.id("users"),
    totalGames: v.number(),
    winsX: v.number(),
    winsO: v.number(),
    draws: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  // 3. Історія партій гравця
  games: defineTable({
    userId: v.id("users"),
    winner: v.union(v.literal("X"), v.literal("O"), v.literal("DRAW")),
    board: v.array(v.union(v.string(), v.null())),
    winningCombination: v.optional(v.array(v.number())),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_creation", ["userId", "createdAt"]),
});