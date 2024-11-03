import { Prisma } from "@prisma/client";
import prisma from "../../prisma/client";

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
    //   // find venue in google places
    const { candidates } = await fetch(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?inputtype=textquery&input=${slug}&fields=place_id,photos&key=${process.env.GOOGLE_PLACES_API_KEY}`,
    ).then((res) => res.json());

    // Use places 2.0
    const googlePlacesVenue = await fetch(
      `${process.env.WEBSITE_URL}/api/venues/${candidates[0].place_id}`,
    ).then((res) => res.json());

    //  fetch picture
    const googlePlacesVenueImage = await fetch(
      `https://places.googleapis.com/v1/${googlePlacesVenue.photos[0].name}/media?maxHeightPx=400&maxWidthPx=400&skipHttpRedirect=true&key=${process.env.GOOGLE_PLACE_NEW_API_KEY}`,
    ).then((res) => res.json());

    const venue = {
      picture: googlePlacesVenueImage.photoUri || "/placeholder.png",
      about: "",
      name: googlePlacesVenue.displayName.text,
      slug: googlePlacesVenue.displayName.text
        .toLowerCase()
        .replace(/\s+/g, "-"),
      followers: 0,
      parties: [],
    };

    return Response.json(venue);
  }

  return Response.json(venue);
}
