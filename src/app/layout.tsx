import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";



const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "NAZ Medical | Trusted Medical Supplies Partner",
  description:
    "Modern NAZ Medical experience with secure staff portal and Convex-powered admin tools.",
  icons: {
    icon: "/img/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full bg-[#F7FAF7]" data-scroll-behavior="smooth">
        <body
          className={`${inter.variable} min-h-screen bg-[#F7FAF7] font-sans text-slate-900 antialiased`}
        >
          <Providers>{children}</Providers>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
