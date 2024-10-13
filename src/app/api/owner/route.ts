import prisma from "../../../../prisma/client";

export async function POST(req: Request) {
  const { username } = await req.json();

  const venues = await prisma.venue.findMany({
    where: {
      owner: {
        username,
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  return Response.json({
    venues,
  });
}
