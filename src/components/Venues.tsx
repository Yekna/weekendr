"use client";

import { Venue } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

type Props = {
  letter: string;
  venues: Venue[];
};

export default function Venues(props: Props) {
  const { letter, venues } = props;

  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => venue.name.startsWith(letter));
  }, [venues, letter]);

  return (
    <>
      {filteredVenues.map((venue) => (
        <Link href={venue.slug} key={venue.id} className="group mx-auto">
          <div
            className="group-hover:brightness-100 sm:brightness-75 transition sm:w-24 w-20 sm:h-24 h-20 rounded-full overflow-hidden mx-auto"
          >
            <Image
              src={venue.picture || "/placeholder.png"}
              className="w-full h-full flex items-center object-cover"
              alt={venue.id}
              width={150}
              height={150}
            />
          </div>
          <p className="text-center">{venue.name}</p>
        </Link>
      ))}
    </>
  );
}
