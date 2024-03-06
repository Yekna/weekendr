export async function GET(req: Request) {
  const NAME = new URL(req.url).searchParams.get("NAME");
  const { photoUri } = await fetch(
    `https://places.googleapis.com/v1/${NAME}/media?maxWidthPx=406&skipHttpRedirect=true&key=${process.env.GOOGLE_PLACE_NEW_API_KEY}`,
  ).then((res) => res.json());

  return Response.json(photoUri, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
