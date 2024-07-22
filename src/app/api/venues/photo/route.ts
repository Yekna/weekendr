export async function GET(req: Request) {
  const names = new URL(req.url).searchParams.get("NAME")?.split(",");
  const namesPromise: Array<Promise<any>> = [];
  names?.forEach((NAME) =>
    namesPromise.push(
      fetch(
        `https://places.googleapis.com/v1/${NAME}/media?maxWidthPx=406&skipHttpRedirect=true&key=${process.env.GOOGLE_PLACE_NEW_API_KEY}`,
      ).then((res) => res.json()),
    ),
  );

  const photoUris: Array<{ photoUri: string }> = (
    await Promise.all(namesPromise)
  ).map(({ photoUri }) => photoUri);

  return Response.json(photoUris, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
