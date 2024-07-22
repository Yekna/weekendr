"use server";

import { signIn } from "@/auth";
import prisma from "../../prisma/client";
import bcrypt from "bcryptjs";

export const registerUser = async (formData: FormData) => {
  try {
    const username = formData.get("username")!.toString();
    const password = formData.get("password")!.toString();
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    const venues = formData.get("venues")!.toString().split(",");
    const { id: ownerId } = await prisma.owner.create({
      data: {
        username,
        password: hashedPassword,
        taxPictures: [""],
      },
    });

    venues!.forEach(async (venue) => {
      const res = await fetch(
        `https://places.googleapis.com/v1/places/${venue}?fields=formattedAddress,displayName.text,photos,websiteUri,userRatingCount,rating,id,nationalPhoneNumber,internationalPhoneNumber,shortFormattedAddress&languageCode=en&key=${process.env.GOOGLE_PLACE_NEW_API_KEY}`,
      );

      const {
        id,
        nationalPhoneNumber,
        internationalPhoneNumber: phone,
        formattedAddress: address,
        rating,
        websiteUri,
        userRatingCount: ratingsCount,
        displayName: { text: name },
        shortFormattedAddress,
        photos,
      }: {
        id: string;
        nationalPhoneNumber: string;
        internationalPhoneNumber: string;
        formattedAddress: string;
        rating: number;
        websiteUri: string;
        userRatingCount: number;
        displayName: { text: string };
        shortFormattedAddress: string;
        photos: Array<{ name: string }>;
      } = await res.json();

      const response =
        await fetch(`https://places.googleapis.com/v1/${photos[0].name}/media?maxHeightPx=400&maxWidthPx=400&skipHttpRedirect=true&key=${process.env.GOOGLE_PLACE_NEW_API_KEY}
`);
      const { photoUri: picture } = await response.json();

      await prisma.venue.create({
        data: {
          id,
          address: address || shortFormattedAddress,
          name,
          phone: phone || nationalPhoneNumber || "",
          ownerId,
          picture,
          rating,
          ratingsCount,
          website: websiteUri || "",
        },
      });
    });

    return {
      success: true,
    };
  } catch (e) {
    return {
      success: false,
    };
  }
};

export const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  // TODO: add try and catch clauses
  await signIn("credentials", {
    username,
    password,
    // redirect: true,
    redirectTo: "/",
  });

  return { success: "Logged in!" };
};
