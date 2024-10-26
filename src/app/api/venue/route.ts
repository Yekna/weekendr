import bcrypt from "bcryptjs";
import prisma from "../../../../prisma/client";
import nodemailer from "nodemailer";
import { z } from "zod";
import { NextResponse } from "next/server";

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

  const schema = z.object({
    username: z
      .string({ required_error: "Username is required" })
      .min(3, { message: "Username needs to be at least 3 characters long" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(10, { message: "Password needs to be at least 10 characters long" }),
    venues: z
      .array(z.string().min(27), {
        required_error: "At least 1 venue needs to be selected",
      })
      .min(1),
    taxPictures: z
      .array(z.string().url(), {
        required_error:
          "You are required to send a picture of your tax returns",
      })
      .min(1),
  });

  const result = schema.safeParse({ username, password, venues, taxPictures });
  if (!result.success) {
    return Response.json({
      message: result.error.errors[0].message,
    });
  }

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

    venues.forEach((venue) => {
      promisesVenues.push(
        fetch(
          `https://places.googleapis.com/v1/places/${venue}?fields=formattedAddress,displayName.text,photos,websiteUri,userRatingCount,rating,id,nationalPhoneNumber,internationalPhoneNumber,shortFormattedAddress,location&languageCode=en&key=${process.env.GOOGLE_PLACE_NEW_API_KEY}`,
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

    // TODO: maybe names and slugs can't be unique because there are venues with same names all over the world
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
      lat: venue.location.latitude,
      lng: venue.location.longitude,
      slug: venue.displayName.text.toLowerCase().replace(/\s+/g, "-"),
    }));

    // TODO: check if venue exists first and if it does associate it with the owner
    await prisma.venue.createMany({ data }).catch(console.log);

    // send email
    // const transporter = nodemailer.createTransport({
    //   host: "mail.privateemail.com",
    //   port: 587,
    //   secure: process.env.NODE_ENV === "development" ? false : true,
    //   auth: {
    //     user: process.env.ADMIN_EMAIL,
    //     pass: process.env.PRIVATE_EMAIL_PASSWORD,
    //   },
    // });
    //
    // // TODO: use email for registration
    // const mail = await transporter.sendMail({
    //   from: process.env.ADMIN_EMAIL,
    //   to: process.env.ADMIN_EMAIL,
    //   subject: `${username} wants to sign up`,
    //   html: `
    //     <style>
    //       a { background: salmon; color: white; }
    //     </style>
    //     <p>Hi, Boss</p>
    //     <p>A user with the email ${username}@gmail.com wants to register</p>
    //     <p>Tax returns:</p>
    //     <a href="${taxPictures[0]}">${username} tax image</a>
    //   `,
    // });

    return Response.json({
      message: "Registered",
    });
  } catch (e) {
    return Response.json({
      message: "Failed",
    });
  }
}

export async function PATCH(req: Request) {
  const { id, followers, following } = (await req.json()) as {
    id: string;
    followers: number;
    following: string[];
  };

  try {
    await prisma.venue.update({
      where: {
        id,
      },
      data: {
        followers: following.find((f) => f === id)
          ? followers - 1
          : followers + 1,
      },
    });
  } catch (e) {
    // if venue doesn't exist create it
    // TODO: check ip address and make sure nobody can use this more than 10 times within a minute for example
    const googlePlacesVenue = await fetch(
      `${process.env.WEBSITE_URL}/api/venues/${id}`,
    ).then((res) => res.json());

    const googlePlacesVenueImage = await fetch(
      `https://places.googleapis.com/v1/${googlePlacesVenue.photos[0].name}/media?maxHeightPx=400&maxWidthPx=400&skipHttpRedirect=true&key=${process.env.GOOGLE_PLACE_NEW_API_KEY}`,
    ).then((res) => res.json());

    await prisma.venue.create({
      data: {
        address: googlePlacesVenue.formattedAddress,
        id: googlePlacesVenue.id,
        name: googlePlacesVenue.displayName.text,
        phone: googlePlacesVenue.internationalPhoneNumber || "",
        picture: googlePlacesVenueImage.photoUri,
        rating: googlePlacesVenue.rating || 0,
        website: googlePlacesVenue.websiteUri || "",
        ratingsCount: googlePlacesVenue.userRatingCount || 0,
        lat: googlePlacesVenue.location.latitude,
        lng: googlePlacesVenue.location.longitude,
        slug: googlePlacesVenue.displayName.text
          .toLowerCase()
          .replace(/\s+/g, "-"),
        followers: 1,
      },
    });
  }

  return Response.json({
    message: "Successfully updated entry",
  });
}

export async function GET(req: Request) {
  const slug = new URL(req.url).searchParams.get("venue");

  if (!slug) {
    return Response.json({ error: "You forgot to send a slug" });
  }

  const venue = await prisma.venue.findFirst({
    where: {
      slug,
    },
    include: {
      owner: {
        select: {
          username: true,
        },
      },
      parties: {
        select: {
          id: true,
        },
      },
    },
  });

  // create temporary venue so users don't see 99% of our venues aren't registered
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
      address: googlePlacesVenue.formattedAddress,
      id: googlePlacesVenue.id,
      name: googlePlacesVenue.displayName.text,
      phone: googlePlacesVenue.internationalPhoneNumber || "",
      picture: googlePlacesVenueImage.photoUri || "/placeholder.png",
      rating: googlePlacesVenue.rating || 0,
      website: googlePlacesVenue.websiteUri || "",
      ratingsCount: googlePlacesVenue.userRatingCount || 0,
      lat: googlePlacesVenue.location.latitude,
      lng: googlePlacesVenue.location.longitude,
      slug: googlePlacesVenue.displayName.text
        .toLowerCase()
        .replace(/\s+/g, "-"),
      followers: 0,
      parties: [],
    };

    return NextResponse.json(venue, { status: 200 });
  }

  return Response.json(venue);
}
