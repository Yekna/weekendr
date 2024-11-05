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
