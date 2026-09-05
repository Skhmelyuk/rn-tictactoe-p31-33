import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  stats: defineTable({
    totalGames: v.number(),
    winsX: v.number(),
    winsO: v.number(),
    draws: v.number(),
    updatedAt: v.number(),
  }),

  games: defineTable({
    winner: v.union(v.literal("X"), v.literal("O"), v.literal("DRAW")),
    board: v.array(v.union(v.string(), v.null())), // Масив з 9 клітинок
    winningCombination: v.optional(v.array(v.number())), // Наприклад [0, 1, 2]
    createdAt: v.number(), // Timestamp (Date.now())
  }).index("by_creation", ["createdAt"]),
});
