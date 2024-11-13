import Image from "next/image";
import { Dispatch, FC, SetStateAction, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import Button from "./Button2";
import Carousel from "react-multi-carousel";
import { Party } from "@prisma/client";
import "react-multi-carousel/lib/styles.css";
import Parties from "./Parties2";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Venue } from "@/app/api/venues/[id]/route";

type Props = {
  photos?: string[];
  venue?: Venue;
  parties?: Array<Party & { Venue: { name: string } }>;
  setId: Dispatch<SetStateAction<string>>;
  isValidating: boolean;
};

const Sidebar: FC<Props> = ({
  venue,
  photos = [],
  parties,
  setId,
  isValidating,
}) => {
  const [ids, setIds] = useLocalStorage<string[]>("following", []);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    venue && onOpen();
  }, [venue, onOpen]);

  return (
    <Modal
      size="xl"
      className="text-black"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={() => {
        setId("");
      }}
      scrollBehavior={"inside"}
      backdrop="transparent"
      classNames={{
        base: "sm:my-1 mb-0 sm:rounded-large rounded-b-none max-h-[544px]",
      }}
    >
      <ModalContent>
        <ModalHeader>{venue?.displayName.text}</ModalHeader>
        <ModalBody>
          {/* TODO: add a loader that's displayed until isValidating is false instead of showing the placeholder image */}
          {photos.length && !isValidating ? (
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
              width={528}
              height={256}
            />
          )}
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default Sidebar;
