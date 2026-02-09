import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

async function hashPassword(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(salt + password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateSalt(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const signUp = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
    deviceId: v.optional(v.string()),
  },
  handler: async (ctx, { email, password, name, deviceId }) => {
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();

    if (existing) {
      throw new Error("An account with this email already exists.");
    }

    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }

    const salt = generateSalt();
    const passwordHash = await hashPassword(password, salt);

    const userId = await ctx.db.insert("users", {
      email: normalizedEmail,
      passwordHash,
      salt,
      name,
      deviceId,
      createdAt: Date.now(),
    });

    return { userId, email: normalizedEmail };
  },
});

export const login = mutation({
  args: {
    email: v.string(),
    password: v.string(),
    deviceId: v.optional(v.string()),
  },
  handler: async (ctx, { email, password, deviceId }) => {
    const normalizedEmail = email.toLowerCase().trim();

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .first();

    if (!user) {
      throw new Error("Invalid email or password.");
    }

    const passwordHash = await hashPassword(password, user.salt);

    if (passwordHash !== user.passwordHash) {
      throw new Error("Invalid email or password.");
    }

    // Update deviceId if provided and different
    if (deviceId && user.deviceId !== deviceId) {
      await ctx.db.patch(user._id, { deviceId });
    }

    return { userId: user._id, email: user.email, name: user.name };
  },
});

export const validate = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) return null;
    return { userId: user._id, email: user.email, name: user.name };
  },
});
