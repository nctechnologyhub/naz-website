import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    clerkOrganizationId: v.optional(v.string()),
    createdByClerkUserId: v.optional(v.string()),
    createdAt: v.number(),
    createdByUserId: v.optional(v.id("users")),
  })
    .index("by_slug", ["slug"])
    .index("by_clerk_org", ["clerkOrganizationId"]),

  users: defineTable({
    clerkUserId: v.string(),
    email: v.optional(v.string()),
    fullName: v.optional(v.string()),
    role: v.optional(v.string()),
    organizationId: v.optional(v.id("organizations")),
    createdAt: v.number(),
  }).index("by_clerk_user", ["clerkUserId"]),

  products: defineTable({
    name: v.string(),
    description: v.string(),
    status: v.union(v.literal("visible"), v.literal("hidden")),
    attachmentStorageId: v.optional(v.id("_storage")),
    organizationId: v.id("organizations"),
    createdAt: v.number(),
  }).index("by_org", ["organizationId"]),

  homeBanners: defineTable({
    title: v.string(),
    subtitle: v.optional(v.string()),
    ctaLabel: v.optional(v.string()),
    ctaUrl: v.optional(v.string()),
    storageId: v.id("_storage"),
    organizationId: v.id("organizations"),
    createdAt: v.number(),
  }).index("by_org", ["organizationId"]),

  careers: defineTable({
    role: v.string(),
    department: v.string(),
    location: v.string(),
    reportTo: v.string(),
    jobStatus: v.string(),
    requirements: v.array(v.string()),
    jobScope: v.array(v.string()),
    organizationId: v.id("organizations"),
    createdAt: v.number(),
  }).index("by_org", ["organizationId"]),

  certifications: defineTable({
    issuer: v.string(),
    name: v.string(),
    standard: v.string(),
    scope: v.string(),
    issuedDate: v.string(),
    expiredDate: v.string(),
    attachmentStorageId: v.optional(v.id("_storage")),
    organizationId: v.id("organizations"),
    createdAt: v.number(),
  }).index("by_org", ["organizationId"]),
});
