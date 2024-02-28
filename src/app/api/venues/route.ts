import { LngLatBounds } from "react-map-gl";

export async function GET(req: Request) {
  const value = new URL(req.url).searchParams.get("value");

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
  const radius = (R * c) / 2; // NEEDS SOME FINE TUNING

  const locationRestriction = {
    circle: {
      center: {
        latitude,
        longitude,
      },
      radius,
    },
  };
  const res = await fetch(
    "https://places.googleapis.com/v1/places:searchNearby",
    {
      headers: {
        "X-Goog-Api-Key": process.env.GOOGLE_PLACE_NEW_API_KEY,
        "X-Goog-FieldMask": "places.id,places.location",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      } as any,
      body: JSON.stringify({
        locationRestriction,
        includedTypes: ["bar", "night_club", "cafe"],
        languageCode: "en", // for some reason without this it defaults to * even though in the docs it says it is en
      }),
      method: "POST",
    },
  );

  const data = await res.json();

  return Response.json(data.places, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
