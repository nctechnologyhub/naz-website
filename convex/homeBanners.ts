import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { ensureDefaultOrganizationId } from "./organizations";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const banners = await ctx.db.query("homeBanners").collect();
    return await Promise.all(
      banners.map(async (banner) => {
        const imageUrl = await ctx.storage.getUrl(banner.storageId);
        return { ...banner, imageUrl };
      })
    );
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    subtitle: v.optional(v.string()),
    ctaLabel: v.optional(v.string()),
    ctaUrl: v.optional(v.string()),
    storageId: v.id("_storage"),
    organizationId: v.optional(v.id("organizations")),
  },
  handler: async (ctx, args) => {
    const organizationId =
      args.organizationId ?? (await ensureDefaultOrganizationId(ctx));

    return await ctx.db.insert("homeBanners", {
      title: args.title,
      subtitle: args.subtitle,
      ctaLabel: args.ctaLabel,
      ctaUrl: args.ctaUrl,
      storageId: args.storageId,
      organizationId,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("homeBanners") },
  handler: async (ctx, args) => {
    const banner = await ctx.db.get(args.id);
    if (banner?.storageId) {
      await ctx.storage.delete(banner.storageId);
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
