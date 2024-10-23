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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Props = {
  setId: Dispatch<SetStateAction<string>>;
  id: string;
};

const Map: FC<Props> = ({ setId, id }) => {
  const venueRef = useRef<HTMLDivElement | null>(null);
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
    primaryType: "night_club" | "bar";
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
    (id: string, primaryType: "night_club" | "bar") => {
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
    results: Array<{
      formatted_address: string;
      geometry: {
        location: { lat: number; lng: number };
        viewport: {
          northeast: { lat: number; lng: number };
          southwest: { lat: number; lng: number };
        };
      };
      name: string;
    }>;
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
              onNextClick: () => {
                venueRef.current?.click();
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
            element: ".slider button:nth-child(3)",
            popover: {
              title: "Image Slider",
              description: "Clicking on this will change the image.",
              side: "top",
            },
          },
          {
            element: ".step-5",
            popover: {
              title: "Close sidebar button",
              description:
                "Finally you can click on this button to close the sidebar.",
              side: "bottom",
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
    <div
      style={{ height: "calc(100dvh - 64px)" }}
      className="text-black overflow-hidden"
    >
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
          className="absolute z-50 flex flex-col"
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
              fetchedLocationData.results.map((data) => (
                <Button
                  className="rounded-t-none w-full hover:bg-gray-700"
                  key={data.formatted_address}
                  onClick={() =>
                    changeViewport(
                      data.geometry.location.lat,
                      data.geometry.location.lng,
                    )
                  }
                >
                  {`${data.name} (${data.formatted_address})`}
                </Button>
              ))}
          </div>
        </div>
        {venues ? (
          venues.map((venue, index) =>
            index ? (
              <Marker
                key={venue.id}
                onClick={() => setId(venue.id)}
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
            ) : (
              <Marker
                key={venue.id}
                onClick={() => setId(venue.id)}
                latitude={venue.location.latitude}
                longitude={venue.location.longitude}
              >
                <div
                  title={genre(venue.id, venue.primaryType)}
                  ref={venueRef}
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
            ),
          )
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
