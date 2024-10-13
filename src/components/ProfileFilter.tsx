"use client";

import Button from "@/components/Button2";
import Venues from "./Venues";
import { Venue } from "@prisma/client";
import { FC, useMemo, useState } from "react";

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

type Props = {
  venues: Venue[];
};

const ProfileFilter: FC<Props> = ({ venues }) => {
  const firstLetters = useMemo(
    () => new Set(venues.map((venue) => venue.name[0])),
    [venues],
  );
  const [letter, setLetter] = useState<string>(
    firstLetters.values().next().value,
  );

  return (
    <>
      <div className="flex overflow-x-scroll pb-3">
        {letters.map((letter, i) => (
          <Button
            className="min-w-min"
            disabled={!firstLetters.has(letter)}
            onClick={() => setLetter(letter)}
            key={letter + i}
          >
            {letter}
          </Button>
        ))}
      </div>
      <div className="grid pt-2 grid-cols-2 sm:grid-cols-3">
        <Venues letter={letter} venues={venues} />
      </div>
    </>
  );
};

export default ProfileFilter;
