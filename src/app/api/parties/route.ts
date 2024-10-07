import prisma from "../../../../prisma/client";

export async function POST(req: Request) {
  const {
    ids,
    filterBy = "Week",
  }: { ids: string[]; filterBy: "Week" | "Month" | "Year" } = await req.json();

  let lte = new Date(),
    gte = new Date();

  switch (filterBy) {
    case "Week":
      lte.setDate(lte.getDate() + 7);
      break;
    case "Month":
      lte.setMonth(lte.getMonth() + 1);
      break;
    case "Year":
      lte.setFullYear(lte.getFullYear() + 1);
      break;
  }

  const parties = await prisma.party.findMany({
    where: {
      venueId: {
        in: ids,
      },
      date: {
        gte,
        lte,
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
      dateCreated: 'desc',
    },
    take: 10,
  });

  return Response.json({
    parties,
  });
}
