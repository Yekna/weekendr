import { LngLatBounds } from "react-map-gl";
import prisma from "../../../../prisma/client";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  const value = new URL(req.url).searchParams.get("value");

  // TODO: remove cities from being returned
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?inputtype=textquery&input=${value}&fields=formatted_address,name,place_id&key=${process.env.GOOGLE_PLACES_API_KEY}`,
  );

  const { candidates } = await res.json();
  return Response.json(
    { candidates },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}

export async function POST(req: Request) {
  const { bounds } = (await req.json()) as { bounds: LngLatBounds };
  const { _ne, _sw } = bounds;
  const { lat: lat1, lng: lng1 } = _sw;
  const { lat: lat2, lng: lng2 } = _ne;
  const latitude = lat2 - (lat2 - lat1) / 2;
  const longitude = lng2 - (lng2 - lng1) / 2;

  const toRadians = (degree: number) => (degree * Math.PI) / 180;

  const lat1R = toRadians(lat1);
  const lon1R = toRadians(lng1);
  const lat2R = toRadians(lat2);
  const lon2R = toRadians(lng2);

  const dlat = lat2R - lat1R;
  const dlon = lon2R - lon1R;

  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const R = 6371000; // EARTH'S RADIUS IN METERS
  const radius = (R * c) / 2; // TODO: NEEDS SOME FINE TUNING

  const locationRestriction = {
    circle: {
      center: {
        latitude,
        longitude,
      },
      radius,
    },
  };

  let {
    places: clubPlaces,
  }: {
    places:
      | Array<{
          id: string;
          location: { latitude: number; longitude: number };
        }>
      | undefined;
  } = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
    headers: {
      "X-Goog-Api-Key": process.env.GOOGLE_PLACE_NEW_API_KEY,
      "X-Goog-FieldMask": "places.id,places.location,places.primaryType,places.displayName",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    } as any,
    body: JSON.stringify({
      locationRestriction,
      includedPrimaryTypes: ["night_club"],
      excludedPrimaryTypes: ["restaurant"],
      languageCode: "en",
    }),
    method: "POST",
  }).then((res) => res.json());

  let {
    places: barPlaces,
  }: {
    places:
      | Array<{
          id: string;
          location: { latitude: number; longitude: number };
        }>
      | undefined;
  } = await fetch("https://places.googleapis.com/v1/places:searchNearby", {
    headers: {
      "X-Goog-Api-Key": process.env.GOOGLE_PLACE_NEW_API_KEY,
      "X-Goog-FieldMask": "places.id,places.location,places.primaryType,places.displayName",
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    } as any,
    body: JSON.stringify({
      locationRestriction,
      includedPrimaryTypes: ["bar"], // FOR SOME DUMB REASON SOME RESTAURANTS SET THEMSLEVES AS BARS SO THEY'RE ALSO RETURNED
      excludedPrimaryTypes: ["restaurant"],
      languageCode: "en",
    }),
    method: "POST",
  }).then((res) => res.json());

  const processedVenues = new Set();

  if (!clubPlaces) {
    clubPlaces = [];
  }
  if (!barPlaces) {
    barPlaces = [];
  }

  const places = [...clubPlaces, ...barPlaces].filter(({ id }) => {
    if (!processedVenues.has(id)) {
      processedVenues.add(id);
      return true;
    }
    return false;
  });

  const venueIds = places.map(({ id }) => id);
  const processedVenueIds = new Set();
  const partyPromises = [];

  // return only the first instance of a venueId that's valid
  for (let venueId of venueIds) {
    if (!processedVenueIds.has(venueId)) {
      const partyPromise = prisma.party.findFirst({
        where: {
          venueId,
          date: {
            gte: new Date(),
          },
        },
        orderBy: {
          date: Prisma.SortOrder.asc,
        },
        select: {
          genre: true,
          venueId: true,
        },
      });
      partyPromises.push(partyPromise);
      processedVenueIds.add(venueId);
    }
  }

  const parties = (await Promise.all(partyPromises)).filter(
    (party) => party !== null,
  );

  return Response.json(
    { places, parties },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
