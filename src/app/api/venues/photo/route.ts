export async function POST(req: Request) {
  const { photos }: { photos: Array<{ name: string }> } = await req.json();

  const venuesPromise: Array<Promise<any>> = [];
  photos?.forEach((photo) =>
    venuesPromise.push(
      fetch(
        `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=448&skipHttpRedirect=true&key=${process.env.GOOGLE_PLACE_NEW_API_KEY}`,
      ).then((res) => res.json()),
    ),
  );

  const photoUris: Array<{ photoUri: string }> = (
    await Promise.all(venuesPromise)
  ).map(({ photoUri }) => photoUri);

  return Response.json(photoUris, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
