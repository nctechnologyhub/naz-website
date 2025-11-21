import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/products",
  "/services",
  "/certifications",
  "/career",
  "/contact",
  "/staff/sign-in",
  "/img(.*)",
  "/robots.txt",
]);

const isIgnoredRoute = createRouteMatcher([
  "/api/webhooks/clerk",
  "/api/vercel/analytics",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req) || isIgnoredRoute(req)) {
    return;
  }

  const { userId } = await auth();
  if (!userId) {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|img/).*)"],
};
