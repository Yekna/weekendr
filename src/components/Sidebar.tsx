"use client";

import Image from "next/image";
import { FC, useMemo } from "react";
import useSWR from "swr";

type Props = {
  isSmallScreen: boolean;
  venue: {
    id: string;
    formattedAddress: string;
    displayName: {
      text: string;
    };
    shortFormattedAddress: string;
    photos: Array<{ name: string }>;
    rating: number;
    websiteUri: string;
    userRatingCount: number;
  };
};

const Sidebar: FC<Props> = ({ isSmallScreen, venue }) => {
  const changeAbsolutePosition = useMemo(() => {
    if (!isSmallScreen) {
      return {
        top: "64px",
        right: "calc(100vw - 406px)",
      };
    }
    return {
      right: 0,
      top: "50%",
    };
  }, [isSmallScreen]);

  const { data: photo } = useSWR(
    () => {
      if(!venue) return null;
      return `/api/venues/photo/?NAME=${venue.photos[0].name}`;
    },
    (url: string) => fetch(url).then((res) => res.json()),
  );

  if (!venue || !photo) return;

  return (
    <aside
      style={{ ...changeAbsolutePosition }}
      className="bg-white overflow-scroll z-20 left-0 bottom-0 absolute"
    >
      <div className="flex flex-col-reverse sm:flex-col">
        <Image
          src={photo || ""}
          alt="Venue Thumbnail"
          width={640}
          height={320}
        />
        <div className="p-5">
          <h1 className="text-2xl">{venue.displayName.text}</h1>
          <div className="flex gap-3 mt-2">
            {venue.rating && venue.userRatingCount ? (
              <>
                <span>{venue.rating}</span>
                <span>
                  {Array.from({
                    length: Math.round(venue.rating),
                  }).map((_, i) => (
                    <span key={i}>*</span>
                  ))}
                </span>
                <span>{`(${venue.userRatingCount})`}</span>
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
            {venue.formattedAddress}
          </p>
        </div>
      </div>
      {venue.websiteUri && (
        <a
          href={venue.websiteUri}
          className="p-5 hover:underline"
          target="_blank"
        >
          {venue.websiteUri}
        </a>
      )}
    </aside>
  );
};

export default Sidebar;
