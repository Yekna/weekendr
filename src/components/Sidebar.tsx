"use client";

import Image from "next/image";
import { FC, useMemo } from "react";

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
        flexBasis: "408px",
        flexShrink: 0,
      };
    }
    return {};
  }, [isSmallScreen]);

  if (!venue) return;

  return (
    <aside
      style={{ ...changeAbsolutePosition }}
      className="bg-white overflow-scroll"
    >
      <div className="sm:flex-col-reverse flex-col">
        <Image
          src="/mladost.jpg"
          alt="Venue Thumbnail"
          width={640}
          height={320}
        />
        <div className="p-5">
          <p className="text-2xl">{venue.displayName.text}</p>
          <div className="flex gap-3 mt-2">
            <span>{venue.rating ? venue.rating : ""}</span>
            <span>
              {Array.from({
                length: Math.round(venue.rating || 0),
              }).map((_, i) => (
                <span key={i}>*</span>
              ))}
            </span>
            <span>
              {venue.userRatingCount ? `(${venue.userRatingCount})` : ""}
            </span>
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
    </aside>
  );
};

export default Sidebar;
