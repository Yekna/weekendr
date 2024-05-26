import prisma from "../../../../prisma/client";

export async function POST(req: Request) {
  const { owner } = await req.json();

  const venue = await prisma.venue.findFirst({
    where: {
      slug: owner,
    },
  });

  return Response.json({
    venue,
  });
}
