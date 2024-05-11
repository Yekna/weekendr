"use client";

import { Party } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { useLocalStorage } from "usehooks-ts";

const Parties = () => {
  const [following] = useLocalStorage<string[]>("following", []);

  const { data } = useSWR<
    Array<{
      id: number;
      name: string;
      tags: string;
      genre: Party["genre"];
      picture: string;
      date: string;
      Venue: {
        name: string;
      };
    }>
  >("/api/parties/", (url: string) =>
    fetch(url, {
      method: "POST",
      body: JSON.stringify({ following }),
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json()),
  );

  if (!data) return <div>Loading...</div>;

  return (
    <ul>
      {data.length ? (
        data.map((venue) => (
          <li className="bg-[#202e4b] p-5" key={venue.id}>
            <Link href="#" className="flex gap-3 items-center">
              <Image
                src={venue.picture}
                alt={venue.name}
                width={100}
                height={0}
              />
              <div className="flex flex-col">
                <h2>{venue.name}</h2>
                <p>{venue.tags}</p>
                <p>{venue.genre}</p>
                <p>{new Date(venue.date).toDateString()}</p>
                <p>Venue: {venue.Venue.name}</p>
              </div>
            </Link>
          </li>
        ))
      ) : (
        <p>You aren&apos;t following any clubs/bars currently</p>
      )}
    </ul>
  );
};

export default Parties;
