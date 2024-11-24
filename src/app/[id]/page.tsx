import ProfileStatistics from "@/components/ProfileStatistics";
import type { Metadata } from "next";
import Image from "next/image";
import { getLimitedVenue } from "@/services";
import Parties from "@/components/Parties4";

// TODO: figure out how to generate custom image for og:image.
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const { id } = params;

  if (id === "service-worker.js" || id === "installHook.js.map") {
    return {
      title: "Service Worker",
    };
  }

  const data = await getLimitedVenue(id, {
    parties: { select: { id: true } },
    followers: true,
    name: true,
    slug: true,
    about: true,
  }).then((res) => res.json());

  return {
    title: `Weekendr - ${data.name}`,
    description: `${data.followers} Followers, ${data.parties.length} Posts - ${data.name} (@${data.slug}) on Weekendr${data?.about ? `: "${data.about}"` : ""}`,
    metadataBase: new URL(process.env.WEBSITE_URL as string),
    openGraph: {
      url: `${process.env.WEBSITE_URL}/${id}`,
      siteName: "Weekendr",
      type: "profile",
      description: `${data.followers} Followers, ${data.parties.length} Posts - See Upcoming Parties from ${data.name} (@${data.slug})`,
    },
  };
}

export default async function Profile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (id === "service-worker.js" || id === "installHook.js.map") return;

  const data = await getLimitedVenue(id, {
    name: true,
    picture: true,
    about: true,
  }).then((res) => res.json());

  if (!data) return;
  const { name, picture, about } = data;

  return (
    <main className="max-w-7xl mx-auto p-5 sm:text-current text-sm min-h-screen sm:min-h-[calc(100vh-64px)]">
      <div className="flex items-center gap-3 justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="sm:w-24 w-20 sm:h-24 h-20 rounded-full overflow-hidden">
            <Image
              src={picture || "/placeholder.png"}
              alt="Profile Picture"
              className="w-full h-full flex items-center object-cover"
              width={150}
              height={150}
            />
          </div>
          <div className="grid" style={{ gridTemplateRows: "auto auto 56px" }}>
            <h2 className="text-2xl font-bold">{name}</h2>
            <ProfileStatistics id={id} />
          </div>
        </div>
      </div>
      <div className="mb-8">
        <p>{about}</p>
      </div>
      <Parties id={id} noPartiesPlaceholder="No Posts Yet" />
    </main>
  );
}
