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
import Shepherd from "shepherd.js";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Props = {
  setId: Dispatch<SetStateAction<string>>;
  id: string;
};

const Map: FC<Props> = ({ setId, id }) => {
  const venueRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapRef | null>(null);
  const [showTutorial, setShowTutorial] = useLocalStorage("showTutorial", true);
  const [viewport, setViewport] = useLocalStorage<ViewState>("viewport", {
    latitude: 46.09167269144208,
    longitude: 19.66244234405549,
    zoom: 10,
    bearing: 0,
    pitch: 30,
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  });
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

  const url = useCallback(
    (id: string) => {
      for (let i = 0; i < parties.length; i++) {
        if (parties[i].venueId === id) {
          switch (parties[i].genre) {
            case "ROCK":
              return "/rock.png";
            case "METAL":
              return "/metal.png";
            case "HIPHOP":
              return "/hiphop.png";
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
    // TODO: find out a way to get venues if the person using this application doesn't have any near him
    if (venues && showTutorial) {
      const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          scrollTo: true,
        },
      });

      tour.addStep({
        id: "step-1",
        text: "These little icons represent your local venues. Clicking on one will show more info",
        attachTo: {
          element: ".step-1",
          on: "bottom",
        },
        buttons: [
          {
            text: "Next",
            action: () => {
              venueRef.current?.click();
              tour.next();
            },
          },
        ],
      });

      tour.addStep({
        id: "step-2",
        text: "This is called the sidebar",
        buttons: [
          {
            text: "Next",
            action: tour.next,
          },
        ],
      });

      tour.addStep({
        id: "step-3",
        text: "It's used to show you all the info you need regarding the venue you clicked on",
        attachTo: {
          element: ".step-3",
          on: isSmallScreen ? "top-start" : "right-end",
        },
        buttons: [
          {
            text: "Next",
            action: tour.next,
          },
        ],
      });

      tour.addStep({
        id: "step-4",
        text: "Clicking this button will follow this particular venue",
        attachTo: {
          element: ".step-4",
          on: "bottom",
        },
        buttons: [
          {
            text: "Next",
            action: tour.next,
          },
        ],
      });

      tour.addStep({
        id: "step-5",
        text: "This is where you will find all future events for the venue you clicked on",
        attachTo: {
          element: ".step-5",
          on: "top",
        },
        buttons: [
          {
            text: "Next",
            action: tour.next,
          },
        ],
      });

      tour.addStep({
        id: "step-6",
        text: "Clicking on this will change the image",
        attachTo: {
          element: ".slider button:nth-child(3)",
          on: "top",
        },
        buttons: [
          {
            text: "Next",
            action: tour.next,
          },
        ],
      });

      tour.addStep({
        id: "step-7",
        text: "Finally click on this button to close the sidebar",
        attachTo: {
          element: ".step-6",
          on: "bottom",
        },
        buttons: [
          {
            text: "Complete",
            action: tour.complete,
          },
        ],
      });

      tour.on("complete", () => {
        setShowTutorial(false);
      });
      tour.on("cancel", () => {
        console.log("canceled");
      });

      tour.start();
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

  const changeViewport = useCallback(
    async (latitude: number, longitude: number) => {
      setViewport((v) => ({ ...v, latitude, longitude }));
      setLocation("");
      setRevalidate(true);
    },
    [setViewport],
  );

  if (!data) return;

  return (
    <div
      style={{ height: "calc(100dvh - 64px)" }}
      className="text-black overflow-hidden"
    >
      <ReactMapGl
        style={{ position: "relative" }}
        minZoom={15}
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
