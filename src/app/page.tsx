"use client";
import Map from "@/components/Map";
import Sidebar from "@/components/Sidebar";
import { Party } from "@prisma/client";
import { useEffect, useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [id, setId] = useState<string>("");
  const [parties, setParties] = useState<
    Array<Party & { Venue: { name: string } }> | undefined
  >();

  const { data: venue } = useSWR<{
    id: string;
    formattedAddress: string;
    displayName: {
      text: string;
    };
    shortFormattedAddress: string;
    photos: {
      name: string;
    }[];
    rating: number;
    websiteUri: string;
    userRatingCount: number;
    nationalPhoneNumber: string;
    internationalPhoneNumber: string;
  }>(() => {
    if (!id) return null;
    return `/api/venues/${id}`;
  }, fetcher);

  const { data: registeredVenue } = useSWR<{
    followers: number;
  }>(() => {
    if (!venue) return null;
    return `/api/venue?venue=${venue.displayName.text.toLowerCase().replace(/\s+/g, "-")}`;
  }, fetcher);

  const { data: photos } = useSWR<Array<string>>(
    () => {
      if (!venue) return null;
      return `/api/venues/photo/?NAME=${venue.photos.map(({ name }) => name).toString()}`;
    },
    (url: string) => fetch(url).then((res) => res.json()),
  );

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const parties = await fetch("/api/parties", {
          method: "POST",
          body: JSON.stringify({ ids: [id] }),
          headers: { "Content-Type": "application/json" },
        }).then((res) => res.json());
        return parties;
      };
      fetchData().then(setParties);
    }
  }, [id]);

  return (
    <main>
      <Sidebar
        registeredVenue={registeredVenue}
        parties={parties}
        photos={photos}
        venue={venue}
        setId={setId}
      />
      <Map id={id} setId={setId} />
    </main>
  );
}
