import Image from "next/image";
import { FC, useMemo } from "react";
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
};

const Sidebar: FC<Props> = ({ venue, photos, parties = [] }) => {
  const isSmallScreen = useMediaQuery("(max-width: 640px)");
  const [ids, setIds] = useLocalStorage<string[]>("following", []);
  const changeAbsolutePosition = useMemo(() => {
    if (!isSmallScreen) {
      return {
        top: "64px",
        right: "calc(100dvw - 408px)",
        bottom: 0,
      };
    }
    return {
      right: 0,
      top: "50%",
      bottom: "calc(64px)",
    };
  }, [isSmallScreen]);

  // useEffect(() => {
  //   // setTimeout(() => {
  //   //   if (ref.current) {
  //   //     ref.current.style.transform = "translateX(0)";
  //   //   }
  //   // }, 1000);
  // });

  if (!venue) return;

  return (
    <aside
      // TODO: try using state to set translateX(-100% | 0%)
      style={{
        ...changeAbsolutePosition,
      }}
      className="bg-white overflow-scroll z-20 left-0 absolute transition-transform text-black"
    >
      <div className="flex flex-col-reverse sm:flex-col sm:p-0 p-5">
        {photos?.length ? (
          <Carousel
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
                src={photo}
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
          {venue.websiteUri && (
            <a
              href={venue.websiteUri}
              className="hover:underline"
              target="_blank"
            >
              {venue.websiteUri}
            </a>
          )}
          {venue.internationalPhoneNumber && (
            <a
              href={`tel:${venue.internationalPhoneNumber}`}
              className="hover:underline"
            >
              {venue.internationalPhoneNumber}
            </a>
          )}
          <Button
            className="mt-3"
            onClick={() =>
              setIds((ids) =>
                ids.length
                  ? ids.find((f) => f === venue.id)
                    ? ids.filter((f) => f !== venue.id)
                    : [...ids, venue.id]
                  : [venue.id],
              )
            }
          >
            {ids.find((f) => f === venue.id) ? "Following" : "Follow"}
          </Button>
        </div>
      </div>
      <div className="p-5 pt-0">
        {parties.length ? (
          <>
            <h3>Future events:</h3>
            <Parties parties={parties} noPartiesPlaceholder="" />
          </>
        ) : (
          <div></div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
