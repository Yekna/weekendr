import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { NextUIProvider } from "@nextui-org/react";
import { SessionProvider } from "next-auth/react";
import PayPalProvider from "@/providers/PaypalProvider";
import "driver.js/dist/driver.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Weekendr",
  description: "Find clubs and bars near you",
  other: {
    "og:image": `${process.env.WEBSITE_URL}/5da269df3e90dc74d9eec6ea742968d4ca0ba88e_s2_n2_y3.png`,
  },
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
            <PayPalProvider>
              <Header />
              <NextSSRPlugin
                routerConfig={extractRouterConfig(ourFileRouter)}
              />
              {children}
            </PayPalProvider>
          </NextUIProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
