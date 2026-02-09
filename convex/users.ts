import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getOrCreate = mutation({
  args: { deviceId: v.string() },
  handler: async (ctx, { deviceId }) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", deviceId))
      .first();

    if (existing) return existing._id;

    // Create an anonymous user linked to this device
    return await ctx.db.insert("users", {
      email: `device-${deviceId}@ghosttype.local`,
      passwordHash: "",
      salt: "",
      deviceId,
      createdAt: Date.now(),
    });
  },
});

export const get = query({
  args: { deviceId: v.string() },
  handler: async (ctx, { deviceId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_deviceId", (q) => q.eq("deviceId", deviceId))
      .first();
  },
});

export const getById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});
