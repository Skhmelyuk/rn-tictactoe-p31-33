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
});
