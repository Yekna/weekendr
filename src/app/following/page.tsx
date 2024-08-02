"use client";

import Parties from "@/components/Parties2";
import { Party } from "@prisma/client";
import useSWR from "swr";
import { useLocalStorage } from "usehooks-ts";

export default function Following() {
  const [ids] = useLocalStorage<string[]>("following", []);

  const { data: parties } = useSWR<Array<Party & { Venue: { name: string } }>>(
    "/api/parties/",
    (url: string) =>
      fetch(url, {
        method: "POST",
        body: JSON.stringify({ ids }),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()),
  );

  return (
    <main style={{ minHeight: "calc(100dvh - 64px)" }}>
      <Parties
        parties={parties}
        noPartiesPlaceholder="You aren't following any clubs/bars currently OR there are no future events planned."
      />
    </main>
  );
}
