import prisma from "../../../../prisma/client";

export async function POST(req: Request) {
  const { name, tags, genre, picture, date, venueId } = await req.json();

  const newTags = tags.replace(",", ", ");

  const newDate = new Date(date);
  const isoDateTime = newDate.toISOString();

  const venue = await prisma.venue.findFirstOrThrow({
    where: {
      slug: venueId,
    },
    select: {
      id: true,
    },
  });

  await prisma.party.create({
    data: {
      date: isoDateTime,
      genre,
      name,
      picture,
      tags: newTags,
      venueId: venue.id,
    },
  });

  return Response.json({ message: "Successfully created new party!" });
}
