export async function GET() {
  return Response.json(
    { token: process.env.MAPBOX_TOKEN },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
