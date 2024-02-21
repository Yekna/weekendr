"use client";

import Image from "next/image";
import { FC, useMemo } from "react";
// import venues from "@/app/api/venues/data";

type Props = {
  isSmallScreen: boolean;
  venue: {
    data: {
      result: {
        rating: number;
        user_ratings_total: number;
        formatted_address: string;
        opening_hours: {
          open_now: boolean;
          periods: Array<{ close: { day: number; time: string } }>;
        };
        formatted_phone_number: string;
        name: string;
        photos: Array<{ photo_reference: string }>;
        user_rating_total: number;
        vicinity: string;
        website: string;
      };
    };
  } | null;
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

  if (!venue) return null;

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
          <p className="text-2xl">{venue.data.result.name}</p>
          <div className="flex gap-3 mt-2">
            <span>
              {venue.data.result.rating ? venue.data.result.rating : ""}
            </span>
            <span>
              {Array.from({
                length: Math.round(venue.data.result.rating || 0),
              }).map((_, i) => (
                <span key={i}>*</span>
              ))}
            </span>
            <span>
              {venue.data.result.user_ratings_total
                ? `(${venue.data.result.user_ratings_total})`
                : ""}
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
            {venue.data.result.formatted_address}
          </p>
          <p>{venue.data.result.opening_hours?.open_now ? "OPEN" : "CLOSED"}</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
