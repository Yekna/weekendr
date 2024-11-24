"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { Party, Venue } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import useSWR from "swr";

type ExtendedParty = Party & {
  Venue: Venue;
};

type Props = {
  id: string;
  noPartiesPlaceholder: string;
};

const Parties: FC<Props> = ({ id, noPartiesPlaceholder }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { data: parties } = useSWR<ExtendedParty[] | undefined>(
    `/api/parties?slug=${id}`,
    (url: string) =>
      fetch(url)
        .then((res) => res.json())
        .then(({ parties }) => parties),
  );
  const [party, setParty] = useState<(Party & { Venue: Venue }) | undefined>();

  useEffect(() => {
    party?.media.length && onOpen();
  }, [party, onOpen]);

  if (!parties)
    return (
      <div>Loading...</div>
    );

  return (
    <>
      <ul className="grid gap-1 md:gap-5 grid-cols-2 md:grid-cols-3">
        {parties.length ? (
          parties.map((venue) => (
            <li key={venue.id} className="relative h-32 md:h-64">
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  history.pushState(null, "", `/p/${venue.id}`);
                  setParty(venue);
                }}
                href=""
              >
                <Image
                  className="rounded-lg h-full w-full object-cover"
                  src={venue.media[0]}
                  alt={venue.name}
                  width={400}
                  height={400}
                />
                {venue.media.length > 1 && (
                  <svg
                    className="absolute top-3 right-3 text-white"
                    aria-label="Carousel"
                    fill="currentColor"
                    height="20"
                    role="img"
                    viewBox="0 0 48 48"
                    width="20"
                  >
                    <path d="M34.8 29.7V11c0-2.9-2.3-5.2-5.2-5.2H11c-2.9 0-5.2 2.3-5.2 5.2v18.7c0 2.9 2.3 5.2 5.2 5.2h18.7c2.8-.1 5.1-2.4 5.1-5.2zM39.2 15v16.1c0 4.5-3.7 8.2-8.2 8.2H14.9c-.6 0-.9.7-.5 1.1 1 1.1 2.4 1.8 4.1 1.8h13.4c5.7 0 10.3-4.6 10.3-10.3V18.5c0-1.6-.7-3.1-1.8-4.1-.5-.4-1.2 0-1.2.6z"></path>
                  </svg>
                )}
              </Link>
            </li>
          ))
        ) : (
          <p>{noPartiesPlaceholder}</p>
        )}
      </ul>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onClose={() => {
          setParty(undefined);
          history.back();
        }}
        classNames={{
          base: "border-[#292f46] bg-gray-900 text-[#a8b0d3] max-w-xl",
          closeButton: "hover:bg-gray-700 active:bg-gray-700",
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            {party?.name}
          </ModalHeader>
          <ModalBody>
            <Swiper className="w-full">
              {party?.media.map((image) => (
                <SwiperSlide key={image}>
                  <Image width={528} height={0} src={image} alt={""} />
                </SwiperSlide>
              ))}
            </Swiper>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Parties;
