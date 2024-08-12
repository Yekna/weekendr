import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Party",
  description: "Create new party for your venue",
};

export default function CreateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
