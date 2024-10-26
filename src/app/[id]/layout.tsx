import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = params;

  if(id === 'service-worker.js') {
    return {
      title: "Service Worker"
    }
  }

  const data = await fetch(
    `${process.env.WEBSITE_URL}/api/venue?venue=${id}`,
  ).then((res) => res.json());

  return {
    title: `Weekendr - ${data.name}`,
    description: data?.description
      ? `${data.name} - ${data.description}`
      : "No description for this venue",
    metadataBase: new URL(process.env.WEBSITE_URL as string),
    openGraph: {
      url: `${process.env.WEBSITE_URL}/${id}`,
      siteName: "Weekendr",
      type: "profile",
    },
  };
}

export default function CreateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
