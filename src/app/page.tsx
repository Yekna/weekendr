"use client";
import Map from "@/components/Map";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Home() {
  const [id, setId] = useState<string>("");
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
  const { data: photos } = useSWR<Array<string>>(
    () => {
      if (!venue) return null;
      return `/api/venues/photo/?NAME=${venue.photos.map(({ name }) => name).toString()}`;
    },
    (url: string) => fetch(url).then((res) => res.json()),
    { revalidateOnFocus: false },
  );

  return (
    <main>
      <Sidebar photos={photos} venue={venue} />
      <Map id={id} setId={setId} />
    </main>
  );
}
