"use client";
import Map from "@/components/Map";
import Sidebar from "@/components/Sidebar2";
import { Party } from "@prisma/client";
import { useState } from "react";
import useSWR from "swr";
import { Venue } from "./api/venues/[id]/route";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [id, setId] = useState<string>("");

  const { data: venue } = useSWR<Venue>(
    () => {
      if (!id) return null;
      return `/api/venues/${id}`;
    },
    fetcher,
    { revalidateOnFocus: false },
  );

  const { data: parties } = useSWR<
    Array<Party & { Venue: { name: string } }> | undefined
  >(
    () => {
      if (!id) return null;
      return "/api/parties";
    },
    (url: string) =>
      fetch(url, {
        method: "POST",
        body: JSON.stringify({ ids: [id] }),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()),
    { revalidateOnFocus: false },
  );

  const { data: photos, isValidating } = useSWR<string[]>(
    () => {
      if (!venue) return null;
      return "/api/venues/photo";
    },
    (url: string) =>
      fetch(url, {
        method: "POST",
        body: JSON.stringify({ photos: venue?.photos }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json()),
    { revalidateOnFocus: false },
  );

  return (
    <main>
      <Sidebar
        isValidating={isValidating}
        photos={photos}
        parties={parties}
        venue={venue}
        setId={setId}
      />
      <Map id={id} setId={setId} />
    </main>
  );
}
