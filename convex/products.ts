import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ensureDefaultOrganizationId } from "./organizations";

const statusValidator = v.union(
  v.literal("visible"),
  v.literal("hidden")
);

export const list = query({
  args: { organizationId: v.optional(v.id("organizations")) },
  handler: async (ctx, args) => {
    const baseQuery = args.organizationId
      ? ctx.db
          .query("products")
          .withIndex("by_org", (q) =>
            q.eq("organizationId", args.organizationId!)
          )
      : ctx.db.query("products");

    const products = await baseQuery.collect();
    return await Promise.all(
      products.map(async (product) => {
        const attachmentUrl = product.attachmentStorageId
          ? await ctx.storage.getUrl(product.attachmentStorageId)
          : undefined;
        return { ...product, attachmentUrl };
      })
    );
  },
});

export const get = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) return null;
    const attachmentUrl = product.attachmentStorageId
      ? await ctx.storage.getUrl(product.attachmentStorageId)
      : undefined;
    return { ...product, attachmentUrl };
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    status: v.optional(statusValidator),
    attachmentStorageId: v.optional(v.id("_storage")),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const organizationId =
      args.organizationId ?? (await ensureDefaultOrganizationId(ctx));
    const status = args.status ?? "visible";

    return await ctx.db.insert("products", {
      name: args.name,
      description: args.description,
      status,
      attachmentStorageId: args.attachmentStorageId,
      organizationId,
      createdAt: Date.now(),
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(statusValidator),
    attachmentStorageId: v.optional(v.id("_storage")),
    removeAttachment: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) {
      throw new Error("Product not found");
    }

    const updates: Record<string, unknown> = {};
    if (args.name !== undefined) updates.name = args.name;
    if (args.description !== undefined) updates.description = args.description;
    if (args.status !== undefined) updates.status = args.status;
    if (args.attachmentStorageId !== undefined) {
      if (existing.attachmentStorageId) {
        await ctx.storage.delete(existing.attachmentStorageId);
      }
      updates.attachmentStorageId = args.attachmentStorageId;
    }
    if (args.removeAttachment) {
      if (existing.attachmentStorageId) {
        await ctx.storage.delete(existing.attachmentStorageId);
      }
      updates.attachmentStorageId = undefined;
    }
    await ctx.db.patch(args.id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (product?.attachmentStorageId) {
      await ctx.storage.delete(product.attachmentStorageId);
    }
    await ctx.db.delete(args.id);
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});
