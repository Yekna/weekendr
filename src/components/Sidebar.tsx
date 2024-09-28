import Image from "next/image";
import { Dispatch, FC, SetStateAction, useMemo } from "react";
import { useLocalStorage, useMediaQuery } from "usehooks-ts";
import Button from "./Button2";
import Carousel from "react-multi-carousel";
import { Party } from "@prisma/client";
import "react-multi-carousel/lib/styles.css";
import Parties from "./Parties2";

type Props = {
  photos?: string[];
  venue?: {
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
    nationalPhoneNumber: string;
    internationalPhoneNumber: string;
  };
  parties?: Array<Party & { Venue: { name: string } }>;
  setId: Dispatch<SetStateAction<string>>;
};

const Sidebar: FC<Props> = ({ venue, photos = [], parties, setId }) => {
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const [ids, setIds] = useLocalStorage<string[]>("following", []);
  const changeAbsolutePosition = useMemo(() => {
    if (!isSmallScreen) {
      return {
        top: "64px",
        right: "calc(100dvw - 408px)",
        bottom: 0,
        transform: venue ? "translateX(0)" : "translateX(-100%)",
      };
    }
    return {
      right: 0,
      top: "50%",
      bottom: "calc(64px)",
      transform: venue ? "translateY(0)" : "translateY(100%)",
    };
  }, [isSmallScreen, venue]);

  return (
    <aside
      style={{
        ...changeAbsolutePosition,
      }}
      className="step-2 bg-white overflow-scroll z-20 left-0 absolute transition-transform text-black"
    >
      <button
        className="step-5 z-30 absolute right-0 hover:bg-gray-700 rounded-bl-lg top-0 bg-gray-800 text-white font-bold focus:outline-none py-1 px-3"
        onClick={() => setId("")}
      >
        X
      </button>
      <div className="relative flex flex-col-reverse sm:flex-col sm:p-0 p-5">
        {photos?.length ? (
          <Carousel
            containerClass="slider"
            itemClass="slide"
            additionalTransfrom={0}
            arrows
            centerMode={false}
            draggable
            focusOnSelect={false}
            infinite
            keyBoardControl
            minimumTouchDrag={80}
            renderArrowsWhenDisabled={false}
            renderButtonGroupOutside={false}
            renderDotsOutside={false}
            responsive={{
              desktop: {
                breakpoint: {
                  max: 3000,
                  min: 1024,
                },
                items: 1,
              },
              mobile: {
                breakpoint: {
                  max: 464,
                  min: 0,
                },
                items: 1,
              },
              tablet: {
                breakpoint: {
                  max: 1024,
                  min: 464,
                },
                items: 1,
              },
            }}
            rewind={false}
            rewindWithAnimation={false}
            rtl={false}
            shouldResetAutoplay
            slidesToSlide={1}
            swipeable
          >
            {photos.map((photo, i) => (
              <Image
                key={photo + i}
                src={photo || "/placeholder.png"}
                alt="Venue Thumbnail"
                width={408}
                height={256}
                className="rounded-xl sm:rounded-none w-full h-full object-cover"
              />
            ))}
          </Carousel>
        ) : (
          <Image
            alt="placeholder image"
            src="/placeholder.png"
            width={408}
            height={256}
          />
        )}
        <div className="sm:p-5 pb-5 flex flex-col">
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
              onClick={() =>
                setIds((ids) =>
                  ids.length
                    ? ids.find((f) => f === venue?.id)
                      ? ids.filter((f) => f !== venue?.id)
                      : [...ids, venue?.id || ""]
                    : [venue?.id || ""],
                )
              }
            >
              {ids.find((f) => f === venue?.id) ? "Following" : "Follow"}
            </Button>
            <Button
              href={`/${venue?.displayName.text.toLowerCase().replace(/\s+/g, "-")}`}
            >
              Profile
            </Button>
          </div>
        </div>
      </div>
      <div className="p-5 pt-0">
        <h3>Future events:</h3>
        <Parties
          parties={parties}
          noPartiesPlaceholder="No events planned yet."
        />
      </div>
    </aside>
  );
};

export default Sidebar;
