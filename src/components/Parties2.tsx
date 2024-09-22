"use client";

import { Party } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

type Props = {
  parties?: Array<Party & { Venue: { name: string } }>;
  noPartiesPlaceholder: string;
};

const Parties: FC<Props> = ({ parties, noPartiesPlaceholder }) => {
  if (!parties)
    return (
      <main style={{ minHeight: "calc(100dvh - 64px)" }}>
        <div>Loading...</div>
      </main>
    );

  return (
    <ul className="step-5 flex flex-col gap-3">
      {parties.length ? (
        parties.map((venue) => (
          <li className="bg-[#202e4b] p-5" key={venue.id}>
            <Link href="#" className="flex gap-3 items-center">
              <Image
                src={venue.media[0]}
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
        <p>{noPartiesPlaceholder}</p>
      )}
    </ul>
  );
};

export default Parties;
