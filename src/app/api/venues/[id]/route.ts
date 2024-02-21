export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&fields=formatted_address,opening_hours,formatted_phone_number,name,photos,rating,user_ratings_total,vicinity,website&key=${process.env.GOOGLE_PLACES_API_KEY}`,
  );

  const data = await res.json();
  return Response.json(
    { data },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
