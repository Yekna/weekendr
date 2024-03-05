"use client";

import { useState, useCallback, useRef } from "react";
import ReactMapGl, {
  MapRef,
  Marker,
  ViewState,
  ViewStateChangeEvent,
} from "react-map-gl";
import { useLocalStorage, useMediaQuery } from "usehooks-ts";
import "mapbox-gl/dist/mapbox-gl.css";
import Sidebar from "./Sidebar";
import useSWR from "swr";
import { Party } from "@prisma/client";
import Image from "next/image";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Map = () => {
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

  const [id, setId] = useState<string>("");
  // const [venues, setVenues] = useState<Array<{
  //   geometry: {
  //     location: { lat: number; lng: number };
  //     viewport: {
  //       northeast: { lat: number; lng: number };
  //       southwest: {
  //         lat: number;
  //         lng: number;
  //       };
  //     };
  //   };
  //   place_id: string;
  //   icon: string;
  // }> | null>(null);
  const [venues, setVenues] = useState<Array<{
    id: string;
    location: { latitude: number; longitude: number };
    primaryType: "night_club" | "bar";
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
  const { data: venue } = useSWR(() => {
    if (!id) return null;
    return `/api/venues/${id}`;
  }, fetcher);

  if (!data) return;

  return (
    <div
      style={{ height: "calc(100vh - 64px)" }}
      className="w-full text-black overflow-hidden flex flex-col-reverse sm:flex-row [&>*]:flex-1"
    >
      <Sidebar venue={venue} isSmallScreen={isSmallScreen} />
      <ReactMapGl
        style={{ cursor: "grab", flex: isSmallScreen ? 1 : "0 1 auto" }}
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
          // if (mapRef.current) {
          //   const {
          //     _ne: { lng: neLng, lat: neLat },
          //     _sw: { lng: swLng, lat: swLat },
          //   } = mapRef.current.getMap().getBounds();
          //   const { places, parties } = await fetch(
          //     `/api/test/?neLng=${neLng}&neLat=${neLat}&swLng=${swLng}&swLat=${swLat}`,
          //   ).then((res) => res.json());
          //   setVenues(places);
          //   setParties(parties);
          // }
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

          // if (mapRef.current) {
          //   const {
          //     _ne: { lng: neLng, lat: neLat },
          //     _sw: { lng: swLng, lat: swLat },
          //   } = mapRef.current.getMap().getBounds();
          //   const { places, parties } = await fetch(
          //     `/api/test/?neLng=${neLng}&neLat=${neLat}&swLng=${swLng}&swLat=${swLat}`,
          //   ).then((res) => res.json());
          //   setVenues(places);
          //   setParties(parties);
          // }
        }}
      >
        {venues &&
          venues.map((venue) => (
            <div key={venue.id} className="z-10">
              <Marker
                latitude={venue.location.latitude}
                longitude={venue.location.longitude}
              >
                {parties.some(({ venueId }) => venueId === venue.id) ? (
                  <Image
                    className="hover:cursor-pointer text-white"
                    onClick={() => setId(venue.id)}
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
                    onClick={() => setId(venue.id)}
                    className="hover:cursor-pointer text-white"
                  />
                )}
              </Marker>
            </div>
          ))}
        {/*{venues &&
          venues.map((d) => (
            <div key={d.place_id} className="z-10">
              <Marker
                latitude={d.geometry.location.lat}
                longitude={d.geometry.location.lng}
              >
                {parties.some(({ venueId }) => venueId === d.place_id) ? (
                  <Image
                    className="hover:cursor-pointer text-white"
                    onClick={() => setId(d.place_id)}
                    src={url(d.place_id)}
                    alt="Genre"
                    width={50}
                    height={50}
                  />
                ) : (
                  <Image
                    src={d.icon}
                    alt={d.place_id}
                    width={25}
                    height={25}
                    className="hover:cursor-pointer"
                    onClick={() => setId(d.place_id)}
                  />
                )}
              </Marker>
            </div>
          ))}*/}
      </ReactMapGl>
      {/*<div
        className="w-10 h-10 hover:cursor-pointer hover:bg-red-500 bg-white"
        style={{ maskImage: `url(${Pin.src})`, maskMode: "alpha" }}
        onClick={() => setId(d.place_id)}
      ></div>*/}
    </div>
  );
};

export default Map;
