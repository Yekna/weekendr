"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import ReactMapGl, {
  LngLatBounds,
  MapRef,
  Marker,
  ViewState,
  ViewStateChangeEvent,
} from "react-map-gl";
import { useLocalStorage } from "usehooks-ts";
import "mapbox-gl/dist/mapbox-gl.css";
import Pin from "../../public/pin.png";
import Sidebar from "./Sidebar";

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
  const [token, setToken] = useState("");
  const [mapBounds, setMapBounds] = useState<LngLatBounds | null>(null);
  const [id, setId] = useState<number>(0);

  const onMove = useCallback(
    (e: ViewStateChangeEvent) => {
      setViewport(e.viewState);
    },
    [setViewport],
  );

  const onLoad = useCallback(() => {
    if (mapRef.current) {
      setMapBounds(mapRef.current.getMap().getBounds());
    }
  }, [mapRef, setMapBounds]);

  useEffect(() => {
    const fetchToken = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/token`, {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      });
      const { token } = await res.json();
      return token;
    };

    fetchToken().then(setToken);
  }, []);

  useEffect(() => {
    onLoad();
  }, [onLoad, viewport]);

  if (!token) return;

  return (
    <div className="text-black relative">
      <ReactMapGl
        style={{ width: "100%", height: "calc(100vh - 64px)", cursor: "grab" }}
        {...viewport}
        mapboxAccessToken={token}
        mapStyle="mapbox://styles/leighhalliday/ckhjaksxg0x2v19s1ovps41ef"
        onMove={onMove}
        onLoad={onLoad}
      >
        <div className="z-10">
          <Marker latitude={46.09167269144208} longitude={19.66244234405549}>
            <div
              data-id={1}
              className="w-10 h-10 hover:cursor-pointer hover:bg-red-500 bg-white"
              style={{
                maskImage: `url(${Pin.src})`, // Tailwind doesn't support mask-image
                maskMode: "alpha", // Tailwind doesn't support mask-mode
              }}
              onClick={() => setId(1)}
            ></div>
          </Marker>
        </div>
      </ReactMapGl>
      <Sidebar setId={setId} id={id} />
    </div>
  );
};

export default Map;
