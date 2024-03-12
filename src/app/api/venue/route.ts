import bcrypt from "bcrypt";
import prisma from "../../../../prisma/client";

// TODO: use zod for schema validation for form data and venuesData
export async function POST(req: Request) {
  const {
    username,
    password,
    venues,
    taxPictures,
  }: {
    username: string;
    password: string;
    venues: string[];
    taxPictures: string[];
  } = await req.json();
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const { id: ownerId } = await prisma.owner.create({
      data: {
        username,
        password: hashedPassword,
        taxPictures,
      },
    });

    const promisesVenues: Array<Promise<any>> = [];


    venues!.forEach((venue) => {
      promisesVenues.push(
        fetch(
          `https://places.googleapis.com/v1/places/${venue}?fields=formattedAddress,displayName.text,photos,websiteUri,userRatingCount,rating,id,nationalPhoneNumber,internationalPhoneNumber,shortFormattedAddress&languageCode=en&key=${process.env.GOOGLE_PLACE_NEW_API_KEY}`,
        ).then((r) => r.json()),
      );
    });

    const venuesData = await Promise.all(promisesVenues);
    const photosPromises: Array<Promise<any>> = [];
    venuesData.forEach((venue) => {
      venue.photos
        ? photosPromises.push(
            fetch(
              `https://places.googleapis.com/v1/${venue.photos[0].name}/media?maxHeightPx=400&maxWidthPx=400&skipHttpRedirect=true&key=${process.env.GOOGLE_PLACE_NEW_API_KEY}`,
            ).then((data) => data.json()),
          )
        : photosPromises.push(
            Promise.resolve({ photoUri: "/placeholder.png" }),
          );
    });

    const photos = await Promise.all(photosPromises);

    const data = venuesData.map((venue, i) => ({
      address: venue.formattedAddress,
      id: venue.id,
      name: venue.displayName.text,
      phone: venue.internationalPhoneNumber || "",
      ownerId,
      picture: photos[i].photoUri,
      rating: venue.rating || 0,
      website: venue.websiteUri || "",
      ratingsCount: venue.userRatingCount || 0,
    }));

    await prisma.venue.createMany({ data }).catch(console.log);

    return Response.json({
      message: "Registered",
    });
  } catch (e) {
    return Response.json({
      message: "Failed",
    });
  }
}
