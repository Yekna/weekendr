import prisma from "../../../../prisma/client";

export async function POST(req: Request) {
  const { following }: { following: string[] } = await req.json();

  const parties = await prisma.party.findMany({
    where: {
      venueId: {
        in: following,
      },
    },
    include: {
      Venue: {
        select: {
          name: true,
        },
      },
    },
  });

  return Response.json(parties);
}

export async function GET(req: Request) {
  const venue = new URL(req.url).searchParams.get("venue");

  const parties = await prisma.party.findMany({
    where: {
      Venue: {
        slug: venue,
      },
    },
    include: {
      Venue: {
        select: {
          name: true,
        },
      },
    },
  });

  return Response.json({
    parties,
  });
}
