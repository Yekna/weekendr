import { Prisma } from "@prisma/client";
import prisma from "../../prisma/client";
import { cookies } from "next/headers";

export async function getLimitedVenue(
  slug: string,
  select: Prisma.VenueSelect,
) {
  const venue = await prisma.venue.findFirst({
    where: {
      slug,
    },
    select,
  });

  if (!venue) {
    const viewport = cookies().get("viewport");

    if (!viewport) {
      const { places } = await fetch(
        "https://places.googleapis.com/v1/places:searchText",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-FieldMask": "places.displayName,places.photos",
            "X-Goog-Api-Key": process.env.GOOGLE_PLACE_NEW_API_KEY,
          } as HeadersInit,
          body: JSON.stringify({ textQuery: slug }),
        },
      ).then((res) => res.json());

      const [data] = places;

      const googlePlacesVenueImage = await fetch(
        `https://places.googleapis.com/v1/${data.photos[0].name}/media?maxHeightPx=256&maxWidthPx=448&skipHttpRedirect=true&key=${process.env.GOOGLE_PLACE_NEW_API_KEY}`,
      ).then((res) => res.json());

      const venue = {
        about: "",
        name: data.displayName.text,
        slug: data.displayName.text.toLowerCase().replace(/\s+/g, ""),
        followers: 0,
        parties: [],
        picture: googlePlacesVenueImage.photoUri || "/placeholder.png",
      };

      return Response.json(venue);
    } else {
      const { places } = await fetch(
        "https://places.googleapis.com/v1/places:searchText",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-FieldMask": "places.displayName,places.photos",
            "X-Goog-Api-Key": process.env.GOOGLE_PLACE_NEW_API_KEY,
          } as HeadersInit,
          body: JSON.stringify({
            textQuery: slug,
            locationBias: JSON.parse(viewport.value),
          }),
        },
      ).then((res) => res.json());

      const [data] = places;

      const googlePlacesVenueImage = await fetch(
        `https://places.googleapis.com/v1/${data.photos[0].name}/media?maxHeightPx=256&maxWidthPx=448&skipHttpRedirect=true&key=${process.env.GOOGLE_PLACE_NEW_API_KEY}`,
      ).then((res) => res.json());

      const venue = {
        about: "",
        name: data.displayName.text,
        slug: data.displayName.text.toLowerCase().replace(/\s+/g, ""),
        followers: 0,
        parties: [],
        picture: googlePlacesVenueImage.photoUri || "/placeholder.png",
      };

      return Response.json(venue);
    }
  }

  return Response.json(venue);
}

export async function getPost(id: string) {
  const post = await prisma.party.findFirst({
    where: {
      id,
    },
  });

  return post;
}
