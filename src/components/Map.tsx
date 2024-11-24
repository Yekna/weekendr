"use client";

import {
  useState,
  useCallback,
  useRef,
  useEffect,
  Dispatch,
  SetStateAction,
  FC,
} from "react";
import ReactMapGl, {
  MapRef,
  Marker,
  ViewState,
  ViewStateChangeEvent,
} from "react-map-gl";
import { useLocalStorage, useMediaQuery } from "usehooks-ts";
import "mapbox-gl/dist/mapbox-gl.css";
import useSWR from "swr";
import { Party } from "@prisma/client";
import Image from "next/image";
import Input from "./Input";
import { useDebounceValue } from "usehooks-ts";
import Button from "./Button";
import { Config, driver } from "driver.js";
import "driver.js/dist/driver.css";
import { DrawerTrigger } from "./ui/drawer";
import { useSidebar } from "./ui/sidebar";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Props = {
  setId: Dispatch<SetStateAction<string>>;
  id: string;
};

function waitForCondition(
  conditionFn: () => boolean,
  interval = 100,
): Promise<void> {
  return new Promise((resolve) => {
    const checkCondition = () => {
      if (conditionFn()) {
        resolve();
      } else {
        setTimeout(checkCondition, interval);
      }
    };
    checkCondition();
  });
}

const Map: FC<Props> = ({ setId, id }) => {
  const { toggleSidebar } = useSidebar();
  const mapRef = useRef<MapRef | null>(null);
  const [showTutorial, setShowTutorial] = useLocalStorage("showTutorial", true);
  const [viewport, setViewport] = useLocalStorage<ViewState | undefined>(
    "viewport",
    undefined,
  );
  const isSmallScreen = useMediaQuery("(max-width: 640px)");

  const [location, setLocation] = useState("");
  const [debouncedLocation] = useDebounceValue(location, 500);
  const [revalidate, setRevalidate] = useState(false);
  const [venues, setVenues] = useState<Array<{
    id: string;
    location: { latitude: number; longitude: number };
    primaryType: "night_club" | "bar" | "pub";
    displayName: {
      text: string;
    };
  }> | null>(null);
  const [parties, setParties] = useState<
    Array<{
      genre: Party["genre"];
      venueId: string;
    }>
  >([]);

  // TODO: Figure out a better way to loop over venues
  const genre = useCallback(
    (id: string, primaryType: "night_club" | "bar" | "pub") => {
      for (let i = 0; i < parties.length; i++) {
        if (parties[i].venueId === id) {
          return parties[i].genre;
        }
        return primaryType;
      }
      return primaryType;
    },
    [parties],
  );

  const url = useCallback(
    (id: string) => {
      for (let i = 0; i < parties.length; i++) {
        if (parties[i].venueId === id) {
          switch (parties[i].genre) {
            case "ROCK":
              return "/rock.svg";
            case "METAL":
              return "/metal.svg";
            case "HIPHOP":
              return "/hiphop.svg";
            case "REGGAE":
              return "/reggae.svg";
            case "RANDB":
              return "/randb.svg";
            case "EDM":
              return "/edm.svg";
            case "POP":
              return "/pop.svg";
            case "FOLK":
              return "/folk.svg";
            case "TRAP":
              return "/trap.svg";
            case "HOUSE":
              return "/house.svg";
            case "TECHNO":
              return "/techno.svg";
          }
        }
      }
      return "/registration.jpg";
    },
    [parties],
  );

  const onMove = useCallback(
    (e: ViewStateChangeEvent) => {
      setViewport(e.viewState);
    },
    [setViewport],
  );

  const { data } = useSWR<{ token: string }>("/api/token", fetcher);
  const { data: fetchedLocationData } = useSWR<{
    places: {
      formattedAddress: string;
      location: {
        latitude: number;
        longitude: number;
      };
      displayName: {
        text: string;
      };
    }[];
  }>(() => {
    if (!debouncedLocation) return null;
    return `/api/location/?query=${debouncedLocation}`;
  }, fetcher);

  useEffect(() => {
    if (showTutorial && venues?.length) {
      const options: Config = {
        showProgress: true,
        steps: [
          {
            element: ".step-1",
            popover: {
              side: "bottom",
              title: "Venue Icons",
              description:
                "These little icons represent your local venues. Clicking on one will show more info.",
              onNextClick: async (e) => {
                // TODO: Maybe instead of clicking on the ref we just use setId(id)
                e instanceof HTMLElement && e.click();
                // setId(venues[0].id);

                await waitForCondition(
                  () => !!document.querySelector(".step-2"),
                );

                tour.moveNext();
              },
            },
          },
          {
            element: ".step-2",
            popover: {
              title: "Venue Sidebar",
              description:
                "The venue siderbar is used to show you all the info you need regarding the venue you clicked on.",
              side: isSmallScreen ? "over" : "right",
            },
          },
          {
            element: ".step-3",
            popover: {
              title: "Follow Button",
              description:
                "Clicking on this button will follow this venue and the parties they host.",
            },
          },
          {
            element: ".step-4",
            popover: {
              title: "Parties List",
              description:
                "This is where you will find all future events for the venue you clicked on.",
              side: "top",
            },
          },
          {
            element: ".step-5",
            popover: {
              title: "Image Slider",
              description:
                "And finally clicking on this button will shift focus to the next image in the gallery.",
              side: "top",
              onNextClick: () => {
                !isSmallScreen ? tour.destroy() : tour.moveNext();
              },
              nextBtnText: !isSmallScreen ? "Done" : "Next →",
            },
          },
        ],
        onDestroyed: () => {
          setShowTutorial(false);
        },
      };
      const tour = driver(options);
      tour.drive();
    }
  }, [venues, showTutorial, setShowTutorial, isSmallScreen]);

  useEffect(() => {
    const refetchData = async () => {
      if (revalidate) {
        if (mapRef.current) {
          const res = await fetch(`/api/venues`, {
            method: "POST",
            body: JSON.stringify({
              bounds: mapRef.current.getMap().getBounds(),
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const { places, parties } = await res.json();
          setVenues(places);
          setParties(parties);
        }
        setRevalidate(false);
      }
    };

    refetchData();
  }, [revalidate]);

  useEffect(() => {
    if (!viewport) {
      fetch("https://ipapi.co/json/")
        .then((res) => res.json())
        .then((data) =>
          setViewport(() => ({
            latitude: data.latitude,
            longitude: data.longitude,
            zoom: 10,
            bearing: 0,
            pitch: 30,
            padding: {
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            },
          })),
        );
    }
  }, [viewport, setViewport]);

  const changeViewport = useCallback(
    async (latitude: number, longitude: number) => {
      setViewport((v) => v && { ...v, latitude, longitude });
      setLocation("");
      setRevalidate(true);
    },
    [setViewport],
  );

  if (!data || !viewport) return;

  return (
    <div className="text-black overflow-hidden h-[100dvh] sm:h-[calc(100vh-64px)]">
      <ReactMapGl
        style={{ position: "relative" }}
        minZoom={isSmallScreen ? 14 : 15}
        maxZoom={18}
        ref={mapRef}
        {...viewport}
        mapboxAccessToken={data.token}
        mapStyle="mapbox://styles/leighhalliday/ckhjaksxg0x2v19s1ovps41ef"
        onMove={onMove}
        onLoad={async () => {
          if (mapRef.current) {
            const res = await fetch(`/api/venues`, {
              method: "POST",
              body: JSON.stringify({
                bounds: mapRef.current.getMap().getBounds(),
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });
            const { places, parties } = await res.json();
            setVenues(places);
            setParties(parties);
          }
        }}
        onMoveEnd={async () => {
          if (mapRef.current) {
            const res = await fetch(`/api/venues`, {
              method: "POST",
              body: JSON.stringify({
                bounds: mapRef.current.getMap().getBounds(),
              }),
              headers: {
                "Content-Type": "application/json",
              },
            });
            const { places, parties } = await res.json();
            setVenues(places);
            setParties(parties);
          }
        }}
      >
        <div
          className="absolute z-40 flex flex-col"
          style={{
            top: isSmallScreen ? "0" : "2.5rem",
            left: isSmallScreen ? "0" : "2.5rem",
            width: isSmallScreen ? "100%" : "328px",
          }}
        >
          <Input
            name="location"
            placeholder="Location..."
            onChange={(e) => setLocation(e.target.value)}
            value={location}
            style={{
              borderBottomRightRadius: location ? "0" : "0.375rem",
              borderBottomLeftRadius: location ? "0" : "0.375rem",
            }}
          />
          <div className="rounded-b-md overflow-hidden">
            {fetchedLocationData &&
              fetchedLocationData.places.map((data) => (
                <Button
                  className="rounded-t-none w-full hover:bg-gray-700"
                  key={data.formattedAddress}
                  onClick={() =>
                    changeViewport(
                      data.location.latitude,
                      data.location.longitude,
                    )
                  }
                >
                  {`${data.displayName.text} (${data.formattedAddress})`}
                </Button>
              ))}
          </div>
        </div>
        {venues ? (
          venues.map((venue, index) => {
            if (isSmallScreen)
              return (
                <DrawerTrigger key={venue.id}>
                  {index ? (
                    <Marker
                      onClick={() => setId(venue.id)}
                      latitude={venue.location.latitude}
                      longitude={venue.location.longitude}
                    >
                      <div
                        title={genre(venue.id, venue.primaryType)}
                        className="flex items-center hover:cursor-pointer transition-transform text-white"
                        style={{
                          transform:
                            id === venue.id ? "scale(1.2)" : "scale(1)",
                        }}
                      >
                        {parties.some(({ venueId }) => venueId === venue.id) ? (
                          <Image
                            src={url(venue.id)}
                            alt="Genre"
                            width={50}
                            height={50}
                          />
                        ) : (
                          <Image
                            src={`/${venue.primaryType}.svg`}
                            alt={venue.primaryType}
                            width={35}
                            height={35}
                          />
                        )}
                        <span>{venue.displayName.text}</span>
                      </div>
                    </Marker>
                  ) : (
                    <Marker
                      onClick={() => setId(venue.id)}
                      latitude={venue.location.latitude}
                      longitude={venue.location.longitude}
                    >
                      <div
                        title={genre(venue.id, venue.primaryType)}
                        className="flex items-center hover:cursor-pointer transition-transform text-white"
                        style={{
                          transform:
                            id === venue.id ? "scale(1.2)" : "scale(1)",
                        }}
                      >
                        {parties.some(({ venueId }) => venueId === venue.id) ? (
                          <Image
                            className="step-1"
                            src={url(venue.id)}
                            alt="Genre"
                            width={50}
                            height={50}
                          />
                        ) : (
                          <Image
                            className="step-1"
                            src={`/${venue.primaryType}.svg`}
                            alt={venue.primaryType}
                            width={35}
                            height={35}
                          />
                        )}
                        <span>{venue.displayName.text}</span>
                      </div>
                    </Marker>
                  )}
                </DrawerTrigger>
              );
            if (index) {
              return (
                <Marker
                  key={venue.id}
                  onClick={() => {
                    setId(venue.id);
                    toggleSidebar();
                  }}
                  latitude={venue.location.latitude}
                  longitude={venue.location.longitude}
                >
                  <div
                    title={genre(venue.id, venue.primaryType)}
                    className="flex items-center hover:cursor-pointer transition-transform text-white"
                    style={{
                      transform: id === venue.id ? "scale(1.2)" : "scale(1)",
                    }}
                  >
                    {parties.some(({ venueId }) => venueId === venue.id) ? (
                      <Image
                        src={url(venue.id)}
                        alt="Genre"
                        width={50}
                        height={50}
                      />
                    ) : (
                      <Image
                        src={`/${venue.primaryType}.svg`}
                        alt={venue.primaryType}
                        width={35}
                        height={35}
                      />
                    )}
                    <span>{venue.displayName.text}</span>
                  </div>
                </Marker>
              );
            }
            return (
              <Marker
                key={venue.id}
                onClick={() => {
                  setId(venue.id);
                  toggleSidebar();
                }}
                latitude={venue.location.latitude}
                longitude={venue.location.longitude}
              >
                <div
                  title={genre(venue.id, venue.primaryType)}
                  className="flex items-center hover:cursor-pointer transition-transform text-white"
                  style={{
                    transform: id === venue.id ? "scale(1.2)" : "scale(1)",
                  }}
                >
                  {parties.some(({ venueId }) => venueId === venue.id) ? (
                    <Image
                      className="step-1"
                      src={url(venue.id)}
                      alt="Genre"
                      width={50}
                      height={50}
                    />
                  ) : (
                    <Image
                      className="step-1"
                      src={`/${venue.primaryType}.svg`}
                      alt={venue.primaryType}
                      width={35}
                      height={35}
                    />
                  )}
                  <span>{venue.displayName.text}</span>
                </div>
              </Marker>
            );
          })
        ) : (
          <div className="absolute -translate-x-1/2 left-1/2 -translate-y-1/2 top-1/2 text-white font-extrabold">
            Loading........
          </div>
        )}
      </ReactMapGl>
    </div>
  );
};

export default Map;
