"use client";
import Map from "@/components/Map";
import { Party } from "@prisma/client";
import { useState } from "react";
import useSWR from "swr";
import { Venue } from "./api/venues/[id]/route";
import DrawerOrDialog from "@/components/Drawer";
import { Drawer } from "@/components/ui/drawer";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [id, setId] = useState<string>("");
  const [open, setOpen] = useState(false);

  const { data: venue, isValidating } = useSWR<Venue>(
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

  return (
    <main>
      <Drawer
        shouldScaleBackground={false}
        onClose={() => setId("")}
        open={open}
        onOpenChange={setOpen}
      >
        <DrawerOrDialog
          setOpen={setOpen}
          open={open}
          isValidating={isValidating}
          parties={parties}
          venue={venue}
        />
        <Map id={id} setId={setId} />
      </Drawer>
    </main>
  );
}
