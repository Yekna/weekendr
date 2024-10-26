import type { Metadata } from "next";

// TODO: figure out how to generate custom image for og:image.
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = params;

  if (id === "service-worker.js") {
    return {
      title: "Service Worker",
    };
  }

  const data = await fetch(
    `${process.env.WEBSITE_URL}/api/venue?venue=${id}`,
  ).then((res) => res.json());

  return {
    title: `Weekendr - ${data.name}`,
    description: `${data.followers} Followers, ${data.parties.length} Posts - See Upcoming Parties from ${data.name}`,
    metadataBase: new URL(process.env.WEBSITE_URL as string),
    openGraph: {
      url: `${process.env.WEBSITE_URL}/${id}`,
      siteName: "Weekendr",
      type: "profile",
      description: `${data.followers} Followers, ${data.parties.length} Posts - See Upcoming Parties from ${data.name}`,
    },
  };
}

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
