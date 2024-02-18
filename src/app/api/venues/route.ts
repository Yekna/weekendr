export async function GET(req: Request) {
  const bounds = new URL(req.url).searchParams.get('bounds');
  // const res = await fetch(
  //   `https://maps.googleapis.com/maps/api/place/textsearch/json?query=bar|night_club|cafe&key=${process.env.GOOGLE_PLACES_API_KEY}&bounds=${bounds}`,
  // );
  // const data = await res.json();
  // console.log(data);

  return Response.json(
    { bounds },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
