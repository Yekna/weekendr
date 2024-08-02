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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Props = {
  setId: Dispatch<SetStateAction<string>>;
  id: string;
};

const Map: FC<Props> = ({ setId, id }) => {
  const mapRef = useRef<MapRef | null>(null);
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
          venues.map((venue) => (
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
          ))
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
