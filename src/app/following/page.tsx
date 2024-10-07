"use client";

import Parties from "@/components/Parties2";
import { Party } from "@prisma/client";
import { useState } from "react";
import useSWR from "swr";
import { useLocalStorage } from "usehooks-ts";

export default function Following() {
  const [ids] = useLocalStorage<string[]>("following", []);
  const [filterBy, setFilterBy] = useState("Week");

  const { data: parties } = useSWR<Array<Party & { Venue: { name: string } }>>(
    "/api/parties/",
    async (url: string) =>
      fetch(url, {
        method: "POST",
        body: JSON.stringify({ ids, filterBy }),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()),
  );

  return (
    <main style={{ minHeight: "calc(100dvh - 64px)" }}>
      <label htmlFor="filterBy">Filter by: </label>
      <select
        id="filterBy"
        onChange={(e) => setFilterBy(e.target.value)}
        className="text-black p-2"
      >
        <option>Week</option>
        <option>Month</option>
        <option>Year</option>
      </select>
      <Parties
        parties={parties}
        noPartiesPlaceholder="You aren't following any clubs/bars currently OR there are no future events planned."
      />
    </main>
  );
}
