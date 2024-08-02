import prisma from "../../../../prisma/client";

export async function POST(req: Request) {
  const { ids }: { ids: string[] } = await req.json();

  const parties = await prisma.party.findMany({
    where: {
      venueId: {
        in: ids,
      },
      date: {
        gte: new Date(),
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
  const slug = new URL(req.url).searchParams.get("slug");

  if (!slug) {
    return Response.json({
      parties: [],
    });
  }

  const parties = await prisma.party.findMany({
    where: {
      Venue: {
        slug,
      },
    },
    include: {
      Venue: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      date: "desc",
    },
    take: 10,
  });

  return Response.json({
    parties,
  });
}
