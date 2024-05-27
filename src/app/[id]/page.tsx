"use client";

import Image from "next/image";
import Button from "@/components/Button";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Head from "next/head";
import { Party, Venue } from "@prisma/client";
import { useLocalStorage } from "usehooks-ts";
import Link from "next/link";

type ExtendedParty = Party & {
  Venue: Venue;
};

export default function Profile() {
  const { id } = useParams<{ id: string }>();
  const [venue, setVenue] = useState<Venue | undefined>();
  const [parties, setParties] = useState<ExtendedParty[]>([]);
  const [following, setFollowing] = useLocalStorage<string[]>("following", []);

  useEffect(() => {
    document.title = id;

    const test = async () => {
      fetch("/api/owner", {
        method: "POST",
        body: JSON.stringify({ owner: id }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(({ venue }) => setVenue(venue));

      fetch(`/api/parties?venue=${id}`)
        .then((res) => res.json())
        .then(({ parties }) => setParties(parties));
    };

    test();
  }, [id]);

  if (venue === null) {
    return <main>Sorry that owner doesn&apos;t seem to exist</main>;
  } else if (venue === undefined) {
    return <main>loading...</main>;
  }

  return (
    <>
      <Head>
        <title>{id}</title>
        <meta name="description" content={`${id} profile page`} />
      </Head>
      <main
        className="max-w-7xl mx-auto p-5 sm:text-current text-sm"
        style={{ minHeight: "calc(100dvh - 64px)" }}
      >
        <div className="flex items-center gap-3 justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="flex flex-col text-center gap-3">
              <div className="sm:w-24 w-20 sm:h-24 h-20 rounded-full overflow-hidden">
                <Image
                  src="/placeholder.png"
                  alt="Profile Picture"
                  className="w-full h-full object-cover"
                  width={150}
                  height={150}
                />
              </div>
              <h2 className="sm:hidden">{venue.name}</h2>
            </div>
            <div>
              <h2 className="text-2xl sm:block hidden font-bold">
                {venue.name}
              </h2>
              <div className="flex items-center space-x-4 mt-2">
                <span>
                  <strong>{venue.posts}</strong> posts
                </span>
                <span>
                  <strong>{venue.followers}</strong> followers
                </span>
              </div>
              <div className="mt-4 flex">
                <Button
                  onClick={async () => {
                    setFollowing((ids) =>
                      ids.length
                        ? following.find((f) => f === venue.id)
                          ? following.filter((f) => f !== venue.id)
                          : [...ids, venue.id]
                        : [venue.id],
                    );

                    const { message } = await fetch("/api/venue", {
                      method: "PATCH",
                      body: JSON.stringify({
                        id: venue.id,
                        followers: venue.followers,
                        following,
                      }),
                    }).then((res) => res.json());

                    setVenue((e) => {
                      if (e) {
                        return {
                          ...e,
                          followers: following.find((f) => f === venue.id)
                            ? e.followers - 1
                            : e.followers + 1,
                        };
                      } else {
                        return e;
                      }
                    });
                  }}
                  className="rounded-lg"
                >
                  {following.find((f) => f === venue.id)
                    ? "Following"
                    : "Follow"}
                </Button>
                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg ml-2">
                  Message
                </button>
              </div>
            </div>
          </div>
          <button className="px-4 py-2 border rounded-lg">Edit Profile</button>
        </div>
        <div className="mb-8">
          <p>{venue.about}</p>
        </div>

        <ul>
          {parties.length &&
            parties.map((party) => (
              <li className="bg-[#202e4b] p-5" key={party.id}>
                <Link href="#" className="flex gap-3 items-center">
                  <Image
                    src={party.picture}
                    alt={party.name}
                    width={100}
                    height={0}
                  />
                  <div className="flex flex-col">
                    <h2>{party.name}</h2>
                    <p>{party.tags}</p>
                    <p>{party.genre}</p>
                    <p>{new Date(party.date).toDateString()}</p>
                    <p>Venue: {party.Venue.name}</p>
                  </div>
                </Link>
              </li>
            ))}
        </ul>
      </main>
    </>
  );
}
