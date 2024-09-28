"use client";

import Image from "next/image";
import Button from "@/components/Button2";
import { useParams } from "next/navigation";
import { Party, Venue } from "@prisma/client";
import { useLocalStorage } from "usehooks-ts";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Parties from "@/components/Parties3";
import useSWR, { mutate } from "swr";

type ExtendedParty = Party & {
  Venue: Venue;
};

export default function Profile() {
  // TODO: compare the session username with the owner of the current venue being viewed
  const session = useSession();
  const { id } = useParams<{ id: string }>();
  const [following, setFollowing] = useLocalStorage<string[]>("following", []);

  const { data: venue } = useSWR<Venue | undefined>(
    `/api/venue?venue=${id}`,
    (url: string) =>
      fetch(url)
        .then((res) => res.json())
        .then(({ venue }) => {
          document.title = venue ? venue.name : "Not Found";
          return venue;
        }),
  );

  const { data: parties } = useSWR<ExtendedParty[] | undefined>(
    `/api/parties?slug=${id}`,
    (url: string) =>
      fetch(url)
        .then((res) => res.json())
        .then(({ parties }) => parties),
  );

  if (venue === null) {
    return (
      <main style={{ minHeight: "calc(100dvh - 64px)" }}>
        Sorry that venue isn&apos;t registered on Weekendr yet
      </main>
    );
  } else if (venue === undefined) {
    return <main style={{ minHeight: "calc(100dvh - 64px)" }}>loading...</main>;
  }

  return (
    <main
      className="max-w-7xl mx-auto p-5 sm:text-current text-sm"
      style={{ minHeight: "calc(100dvh - 64px)" }}
    >
      <div className="flex items-center gap-3 justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex flex-col text-center gap-3">
            <div className="sm:w-24 w-20 sm:h-24 h-20 rounded-full overflow-hidden">
              <Image
                src={venue.picture || "/placeholder.png"}
                alt="Profile Picture"
                className="w-full h-full flex items-center object-cover"
                width={150}
                height={150}
              />
            </div>
            <h2 className="sm:hidden">{venue.name}</h2>
          </div>
          <div>
            <h2 className="text-2xl sm:block hidden font-bold">{venue.name}</h2>
            <div className="flex items-center space-x-4 mt-2">
              <span>
                <strong>{parties?.length}</strong> posts
              </span>
              <span>
                <strong>{venue.followers}</strong> followers
              </span>
            </div>
            <div className="mt-4 flex gap-2 flex-wrap">
              <Button
                onClick={async () => {
                  setFollowing((ids) =>
                    ids.length
                      ? following.find((f) => f === venue.id)
                        ? following.filter((f) => f !== venue.id)
                        : [...ids, venue.id]
                      : [venue.id],
                  );

                  mutate(
                    `/api/venue?venue=${id}`,
                    {
                      followers: "|",
                      name: venue.name,
                      picture: venue.picture,
                      posts: parties?.length,
                      about: venue.about,
                    },
                    false,
                  );

                  const res = await fetch("/api/venue", {
                    method: "PATCH",
                    body: JSON.stringify({
                      id: venue.id,
                      followers: venue.followers,
                      following,
                    }),
                  });

                  if (res.ok) {
                    console.log("uraaaa");
                    mutate(`/api/venue?venue=${id}`);
                  } else {
                    console.log("kurcina");
                  }
                }}
                className="rounded-lg"
              >
                {following.find((f) => f === venue.id) ? "Following" : "Follow"}
              </Button>
              <Link target="_blank" href={`/${id}/create`}>
                <Button className="bg-gray-200 text-gray-700">
                  Create Party
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="mb-8">
        <p>{venue.about}</p>
      </div>
      <Parties parties={parties} noPartiesPlaceholder="No Posts Yet" />
    </main>
  );
}
