import * as React from "react";
import { useLocalStorage, useMediaQuery } from "usehooks-ts";
import Button from "@/components/Button2";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  venue?: Venue;
  parties?: Array<Party & { Venue: { name: string } }>;
  isValidating: boolean;
};

const SkeletonContent = () => (
  <div className="flex flex-col h-[500px]">
    <Skeleton className="h-6 w-full my-4" />
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

export default function DrawerOrDialog({
  open,
  setOpen,
  venue,
  parties,
  isValidating,
}: Props) {
  const [ids, setIds] = useLocalStorage<string[]>("following", []);
  const isDesktop = useMediaQuery("(min-width: 640px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="step-2 max-w-[640px] text-black">
          <DialogHeader className="text-left">
            <DialogTitle>{venue?.displayName.text}</DialogTitle>
            <DialogDescription>{venue?.about}</DialogDescription>
          </DialogHeader>
          {isValidating ? (
            <SkeletonContent />
          ) : (
            <>
              <Carousel className="w-[calc(100%-6rem)] mx-auto">
                <CarouselContent className="h-[256px]">
                  {venue?.photos?.map((photo, i) => (
                    <CarouselItem key={photo + i}>
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

              <div className="flex flex-col">
                <h1 className="text-2xl">{venue?.displayName.text}</h1>
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
                <p>
                  <svg
                    className="inline"
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 384 512"
                    height="1em"
                    width="1em"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path>
                  </svg>{" "}
                  {venue?.formattedAddress}
                </p>
                {venue?.websiteUri && (
                  <a
                    href={venue?.websiteUri || ""}
                    className="hover:underline"
                    target="_blank"
                  >
                    {venue?.websiteUri}
                  </a>
                )}
                {venue?.internationalPhoneNumber && (
                  <a
                    href={`tel:${venue?.internationalPhoneNumber}`}
                    className="hover:underline"
                  >
                    {venue?.internationalPhoneNumber}
                  </a>
                )}
                <div className="flex gap-2 mt-3">
                  <Button
                    className="step-3"
                    onClick={async () => {
                      const res = await fetch("/api/venue", {
                        method: "PATCH",
                        body: JSON.stringify({
                          id: venue?.id,
                          followers: venue?.followers,
                          following: ids,
                        }),
                      });

                      if (res.ok) {
                        setIds((ids) =>
                          ids.length
                            ? ids.find((f) => f === venue?.id)
                              ? ids.filter((f) => f !== venue?.id)
                              : [...ids, venue?.id || ""]
                            : [venue?.id || ""],
                        );
                        console.log("ura");
                      } else {
                        console.log("uva");
                      }
                    }}
                  >
                    {ids.find((f) => f === venue?.id) ? "Following" : "Follow"}
                  </Button>
                  <Button
                    className="bg-gray-200 text-gray-700"
                    href={`/${venue?.displayName.text.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    Profile
                  </Button>
                </div>
              </div>
              <Parties
                parties={parties}
                noPartiesPlaceholder="No events planned for this week."
              />
            </>
          )}
        </DialogContent>
      </Dialog>
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
          <>
            <Carousel className="w-[calc(100%-6rem)] mx-auto">
              <CarouselContent className="h-[256px]">
                {venue?.photos?.map((photo, i) => (
                  <CarouselItem key={photo + i}>
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

            <div className="flex flex-col">
              <h1 className="text-2xl">{venue?.displayName.text}</h1>
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
              <p>
                <svg
                  className="inline"
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 384 512"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M172.268 501.67C26.97 291.031 0 269.413 0 192 0 85.961 85.961 0 192 0s192 85.961 192 192c0 77.413-26.97 99.031-172.268 309.67-9.535 13.774-29.93 13.773-39.464 0zM192 272c44.183 0 80-35.817 80-80s-35.817-80-80-80-80 35.817-80 80 35.817 80 80 80z"></path>
                </svg>{" "}
                {venue?.formattedAddress}
              </p>
              {venue?.websiteUri && (
                <a
                  href={venue?.websiteUri || ""}
                  className="hover:underline"
                  target="_blank"
                >
                  {venue?.websiteUri}
                </a>
              )}
              {venue?.internationalPhoneNumber && (
                <a
                  href={`tel:${venue?.internationalPhoneNumber}`}
                  className="hover:underline"
                >
                  {venue?.internationalPhoneNumber}
                </a>
              )}
              <div className="flex gap-2 mt-3">
                <Button
                  className="step-3"
                  onClick={async () => {
                    const res = await fetch("/api/venue", {
                      method: "PATCH",
                      body: JSON.stringify({
                        id: venue?.id,
                        followers: venue?.followers,
                        following: ids,
                      }),
                    });

                    if (res.ok) {
                      setIds((ids) =>
                        ids.length
                          ? ids.find((f) => f === venue?.id)
                            ? ids.filter((f) => f !== venue?.id)
                            : [...ids, venue?.id || ""]
                          : [venue?.id || ""],
                      );
                      console.log("ura");
                    } else {
                      console.log("uva");
                    }
                  }}
                >
                  {ids.find((f) => f === venue?.id) ? "Following" : "Follow"}
                </Button>
                <Button
                  className="bg-gray-200 text-gray-700"
                  href={`/${venue?.displayName.text.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  Profile
                </Button>
              </div>
            </div>
            <Parties
              parties={parties}
              noPartiesPlaceholder="No events planned for this week."
            />
          </>
        )}
      </div>
    </DrawerContent>
  );
}
