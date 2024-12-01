import { LngLatBounds } from "mapbox-gl";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const textQuery = new URL(req.url).searchParams.get("query");
  const data = await fetch(
    "https://places.googleapis.com/v1/places:searchText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-FieldMask":
          "places.displayName,places.location,places.formattedAddress",
        "X-Goog-Api-Key": process.env.GOOGLE_PLACE_NEW_API_KEY,
      } as HeadersInit,
      body: JSON.stringify({ textQuery }),
    },
  ).then((res) => res.json());

  return Response.json(data);
}

export async function POST(req: Request) {
  const { viewport } = (await req.json()) as {
    viewport: LngLatBounds | undefined;
  };

  if (!viewport) {
    return NextResponse.json({ success: false });
  }

  const { _ne, _sw } = viewport;
  const { lat: lat1, lng: lng1 } = _sw;
  const { lat: lat2, lng: lng2 } = _ne;

  const cookieStore = cookies();
  cookieStore.set(
    "viewport",
    JSON.stringify({
      rectangle: {
        low: {
          latitude: lat1,
          longitude: lng1,
        },
        high: {
          latitude: lat2,
          longitude: lng2,
        },
      },
    }),
    {
      httpOnly: true,
      maxAge: 31536000,
      path: "/",
    },
  );

  return NextResponse.json({ success: true });
}
