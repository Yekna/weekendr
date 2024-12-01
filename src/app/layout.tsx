import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import MobileHeader from "@/components/MobileHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  openGraph: {
    url: process.env.WEBSITE_URL,
    siteName: "Weekendr",
    type: "website",
  },
  title: "Weekendr - Find Clubs And Bars Near You",
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
            <SidebarProvider closeOnLinkClick={true} defaultOpen={false}>
              <MobileHeader />
              <SidebarTrigger className="absolute top-[5px] right-2 z-50 sm:hidden" />
              <NextSSRPlugin
                routerConfig={extractRouterConfig(ourFileRouter)}
              />
              <div className="w-full">{children}</div>
            </SidebarProvider>
          </NextUIProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
