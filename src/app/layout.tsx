import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  openGraph: {
    url: process.env.WEBSITE_URL,
    siteName: "Weekendr",
    type: "website",
  },
  title: "Weekendr",
  description: "Find clubs and bars near you",
  // metadataBase adds a prefix to the opengraph-image.png e.g [https://weekendr.club]/opengraph-image.png
  metadataBase: new URL(process.env.WEBSITE_URL as string),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider>
          <NextUIProvider>
            <Header />
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            {children}
          </NextUIProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
