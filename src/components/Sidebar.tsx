"use client";

import Image from "next/image";
import { FC, useMemo, useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";
import { data } from "./Map";

type Props = {
  setId: (id: string) => void;
  id: string;
};

const Sidebar: FC<Props> = ({ id, setId }) => {
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const venue = useMemo(() => {
    let v;
    for (let i = 0; i < data.length; i++) {
      if (data[i].place_id === id) {
        v = data[i];
        break;
      }
    }

    return v;
  }, [id]);

  const changeAbsolutePosition = useMemo(() => {
    if (!isSmallScreen) {
      return {
        top: 0,
        width: "408px",
      };
    }
    return {
      right: 0,
      height: "50%",
    };
  }, [isSmallScreen]);

  useEffect(() => {
    const fetchPhoto = async () => {
      // FETCH ONLY THE PARTS YOU NEED IF YOU'RE GONNA CALL THE MAIN API
      // await fetch(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=ATplDJalcgBrBGW3EQyE4uQZQubzPmX1skSZEyp6i2oxn8P9nKo-SkxdQeuvdkbAmi8ccpK9pI95wYo0mFjUlNDX9UoF3uToYQP2wqe_rv9HBJjXVNVilvLqam-SdWOTw2aDmFeSrZufWfMug8KHqJ_cm8HwO2IzCFVuiaqilu3Y60BOT9GZ&key=${process.env.GOOGLE_PLACES_API_KEY}`);
    };

    fetchPhoto();
  }, []);

  return (
    <aside
      style={{ display: id ? "block" : "none", ...changeAbsolutePosition }}
      className="absolute left-0 bottom-0 bg-white"
    >
      <div className="sm:flex-col-reverse flex-col">
        <Image
          src="/mladost.jpg"
          alt="Venue Thumbnail"
          width={640}
          height={320}
        />
        <div className="p-5">
          <p className="text-2xl">{venue?.name}</p>
          <div className="flex gap-3 mt-2">
            <span>{venue?.rating ? venue.rating : ""}</span>
            <span>
              {Array.from({ length: Math.round(venue?.rating || 0) }).map((_, i) => (
                <span key={i}>*</span>
              ))}
            </span>
            <span>
              {venue?.user_ratings_total ? `(${venue?.user_ratings_total})` : ""}
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
            {venue?.formatted_address}
          </p>
          <p>{venue?.opening_hours?.open_now ? "OPEN" : "CLOSED"}</p>
        </div>
      </div>
      <button
        className="absolute right-3 top-3 bg-white p-3 rounded-full border border-black"
        style={{ lineHeight: 0 }}
        onClick={() => setId("")}
      >
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M19.002 3h-14c-1.103 0-2 .897-2 2v4h2V5h14v14h-14v-4h-2v4c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.898-2-2-2z"></path>
          <path d="m11 16 5-4-5-4v3.001H3v2h8z"></path>
        </svg>
      </button>
    </aside>
  );
};

export default Sidebar;
