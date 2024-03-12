export async function GET(req: Request) {
  const query = new URL(req.url).searchParams.get('query');
  const data = await fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${query}&key=${process.env.GOOGLE_PLACES_API_KEY}`).then(res => res.json())

  return Response.json(data);
}
