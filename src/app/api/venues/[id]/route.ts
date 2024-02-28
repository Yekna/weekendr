export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  // TODO: fetch data with prisma
  const res = await fetch(
    `https://places.googleapis.com/v1/places/${id}?fields=formattedAddress,displayName.text,photos,websiteUri,userRatingCount,rating,id,nationalPhoneNumber,internationalPhoneNumber,shortFormattedAddress&key=${process.env.GOOGLE_PLACE_NEW_API_KEY}&languageCode=en`,
  );

  const data = await res.json();
  return Response.json(data, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
