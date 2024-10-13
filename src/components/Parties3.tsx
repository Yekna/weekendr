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
    return <div style={{ minHeight: "calc(100dvh - 64px)" }}>Loading...</div>;

  return (
    <ul className="grid gap-5 grid-cols-2 md:grid-cols-3">
      {parties.length ? (
        parties.map((venue) => (
          <li key={venue.id} className="relative h-32 md:h-64">
            <Link
              onClick={(e) => {
                e.preventDefault();
                history.pushState(null, "", `/p/${venue.id}`);
              }}
              href=""
              target="_blank"
            >
              <Image
                className="rounded-lg h-full w-full object-cover"
                src={venue.media[0]}
                alt={venue.name}
                width={400}
                height={400}
              />
              <svg
                className="absolute top-3 right-3 text-white"
                aria-label="Carousel"
                fill="currentColor"
                height="20"
                role="img"
                viewBox="0 0 48 48"
                width="20"
              >
                <path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-.9.7-.5 1.1 1 1.1 2.4 1.8 4.1 1.8h13.4c5.7 0 10.3-4.6 10.3-10.3V18.5c0-1.6-.7-3.1-1.8-4.1-.5-.4-1.2 0-1.2.6z"></path>
              </svg>
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
