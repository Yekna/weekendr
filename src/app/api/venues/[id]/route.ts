import { Party } from "@prisma/client";
import prisma from "../../../../../prisma/client";

export type Venue = {
  id: string;
  displayName: { text: string };
  formattedAddress: string;
  internationalPhoneNumber: string;
  userRatingCount: number;
  rating: number;
  websiteUri: string;
  location: {
    latitude: number;
    longitude: number;
  };
  followers: number;
  parties: Party[];
  photos: Array<{ name: string }>;
};

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  const existingVenue = await prisma.venue.findFirst({
    where: {
      id,
    },
    select: {
      followers: true,
      parties: true,
    },
  });

  const data = await fetch(`https://places.googleapis.com/v1/places/${id}`, {
    headers: {
      "Content-Type": "application/json",
      "X-Goog-FieldMask":
        "displayName,photos,formattedAddress,id,internationalPhoneNumber,rating,websiteUri,userRatingCount,location",
      "X-Goog-Api-Key": process.env.GOOGLE_PLACE_NEW_API_KEY,
    } as HeadersInit,
  }).then((res) => res.json());

  const venue = {
    ...data,
    followers: existingVenue?.followers ?? 0,
    parties: existingVenue?.parties ?? [],
  } as Venue;

  return Response.json(venue);
}
