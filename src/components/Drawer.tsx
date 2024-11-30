import * as React from "react";
import { useLocalStorage, useMediaQuery } from "usehooks-ts";
import Button from "@/components/Button2";
import {
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Party } from "@prisma/client";
import Image from "next/image";
import { Venue } from "@/app/api/venues/[id]/route";
import Parties from "./Parties2";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarContent, Sidebar, useSidebar } from "@/components/ui/sidebar";
import Bookmark from "./Icons/Bookmark";
import Profile from "./Icons/Profile";
import Link from "next/link";
import Website from "./Icons/Website";
import Location from "./Icons/Location";
import Phone from "./Icons/Phone";

type Props = {
  venue?: Venue;
  parties?: Array<Party & { Venue: { name: string } }>;
  isValidating: boolean;
};

const SkeletonContent = () => (
  <div className="flex flex-col h-[500px]">
    <div className="flex items-center gap-4 mx-4">
      <Skeleton className="rounded-full h-8 shrink-0 w-8" />
      <Skeleton className="h-[256px] w-full" />
      <Skeleton className="rounded-full h-8 shrink-0 w-8" />
    </div>
    <Skeleton className="h-8 w-full mt-1" />
    <Skeleton className="mt-2 h-6 w-full" />
    <Skeleton className="h-6 mt-1" />
    <Skeleton className="h-6 mt-1" />
    <Skeleton className="h-6 mt-1" />
    <div className="flex gap-2 mt-3">
      <Skeleton className="w-14 h-8" />
      <Skeleton className="w-14 h-8" />
    </div>
    <Skeleton className="h-6 mt-1" />
  </div>
);

const Content = ({
  venue,
  setIds,
  ids,
  parties,
}: {
  venue?: Venue;
  setIds: React.Dispatch<React.SetStateAction<string[]>>;
  ids: string[];
  parties?: Array<Party & { Venue: { name: string } }>;
}) => {
  const { toggleSidebar, state } = useSidebar();
  return (
    <>
      <Carousel>
        <CarouselContent className="ml-0 h-[256px]">
          {venue?.photos?.map((photo, i) => (
            <CarouselItem className="pl-0" key={photo + i}>
              <Image
                key={photo + i}
                src={photo || "/placeholder.png"}
                alt="Venue Thumbnail"
                width={640}
                height={256}
                className="rounded-xl sm:rounded-none w-full h-full object-cover"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext className="step-5" />
      </Carousel>

      <div className="flex flex-col px-2 gap-1">
        <h1 className="text-2xl">{venue?.displayName.text}</h1>
        <span className="text-sm text-gray-400">
          (
          {`${venue?.primaryType[0].toUpperCase()}${venue?.primaryType.slice(1).replace("_", " ")}`}
          )
        </span>
        <div className="flex gap-3 mt-2">
          {venue?.rating && venue?.userRatingCount ? (
            <>
              <span>{venue?.rating}</span>
              <span className="flex items-center">
                {Array.from({
                  length: Math.round(venue?.rating),
                }).map((_, i) => (
                  <svg
                    key={i}
                    fill="#1f2937"
                    strokeWidth="0"
                    viewBox="0 0 576 512"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z"></path>
                  </svg>
                ))}
              </span>
              <span>{`(${venue?.userRatingCount})`}</span>
            </>
          ) : (
            <p>NO USER REVIEWS</p>
          )}
        </div>
        <span></span>
        <div className="flex items-center gap-1">
          <Location />
          <Link
            title="Get Directions"
            className="hover:underline"
            target="_blank"
            href={`https://www.google.com/maps/dir/?api=1&origin=My+Location&destination=${venue?.formattedAddress}`}
          >
            {venue?.formattedAddress}
          </Link>
        </div>
        {venue?.websiteUri && (
          <div className="flex items-center gap-1">
            <Website />
            <Link
              href={venue?.websiteUri || ""}
              className="hover:underline"
              target="_blank"
            >
              {venue?.websiteUri}
            </Link>
          </div>
        )}
        {venue?.internationalPhoneNumber && (
          <div className="flex items-center gap-1">
            <Phone />
            <Link
              href={`tel:${venue?.internationalPhoneNumber}`}
              className="hover:underline"
            >
              {venue?.internationalPhoneNumber}
            </Link>
          </div>
        )}
        <div className="flex gap-2 mt-3">
          <Button
            className="step-3"
            onClick={async () => {
              setIds((ids) =>
                ids.length
                  ? ids.find((f) => f === venue?.id)
                    ? ids.filter((f) => f !== venue?.id)
                    : [...ids, venue?.id || ""]
                  : [venue?.id || ""],
              );
              const res = await fetch("/api/venue", {
                method: "PATCH",
                body: JSON.stringify({
                  id: venue?.id,
                  followers: venue?.followers,
                  following: ids,
                }),
              });

              if (!res.ok) {
                alert("Something went wrong!");
                setIds((ids) =>
                  ids.length
                    ? ids.find((f) => f === venue?.id)
                      ? ids.filter((f) => f !== venue?.id)
                      : [...ids, venue?.id || ""]
                    : [venue?.id || ""],
                );
              }
            }}
          >
            <Bookmark following={ids.some((f) => f === venue?.id)} />
            {ids.find((f) => f === venue?.id) ? "Following" : "Follow"}
          </Button>
          <Button
            className="bg-gray-200 text-gray-700"
            href={`/${venue?.displayName.text.toLowerCase().replace(/\s+/g, "-")}`}
            onClick={() => state === "expanded" && toggleSidebar()}
          >
            <Profile />
            Profile
          </Button>
        </div>
        <Parties
          parties={parties}
          noPartiesPlaceholder="No events planned for this week."
        />
      </div>
    </>
  );
};

export default function DrawerOrDialog({
  venue,
  parties,
  isValidating,
}: Props) {
  const [ids, setIds] = useLocalStorage<string[]>("following", []);
  const isDesktop = useMediaQuery("(min-width: 640px)");

  if (isDesktop) {
    return (
      <Sidebar className="step-2">
        <SidebarContent>
          {isValidating ? (
            <SkeletonContent />
          ) : (
            <Content
              ids={ids}
              setIds={setIds}
              venue={venue}
              parties={parties}
            />
          )}
        </SidebarContent>
      </Sidebar>
    );
  }

  return (
    <DrawerContent className="text-black step-2 h-[600px]">
      <DrawerHeader className="text-left">
        <DrawerTitle>{venue?.displayName.text}</DrawerTitle>
        <DrawerDescription>{venue?.about}</DrawerDescription>
      </DrawerHeader>

      <div className="overflow-y-auto px-4">
        {isValidating ? (
          <SkeletonContent />
        ) : (
          <Content ids={ids} setIds={setIds} venue={venue} parties={parties} />
        )}
      </div>
    </DrawerContent>
  );
}
