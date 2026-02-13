import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const join = mutation({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const normalised = email.trim().toLowerCase();

    // Skip if already on the waitlist
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", normalised))
      .first();

    if (existing) return { alreadyJoined: true };

    await ctx.db.insert("waitlist", {
      email: normalised,
      createdAt: Date.now(),
    });

    return { alreadyJoined: false };
  },
});
