import bcrypt from "bcrypt";
import prisma from "../../../../prisma/client";
import { cookies } from "next/headers";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  const { username, password }: { username: string; password: string } =
    await req.json();

  const owner = await prisma.owner.findFirst({
    where: {
      username,
    },
  });

  const passwordHashed = owner?.password;

  if (passwordHashed) {
    const result = await bcrypt.compare(password, passwordHashed);
    if (result) {
      // TODO: use an env variable instead of hardcoding
      const key = new TextEncoder().encode("secret");
      const expires = new Date(Date.now() + 60 * 60 * 24 * 7 * 1000);
      const session = await new SignJWT({
        user: { username, password },
        expires,
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("1 week from now")
        .sign(key);
      cookies().set("session", session, { expires, httpOnly: true });
      return Response.json({
        message: "Successfully logged in",
        success: true,
      });
    }
  }

  return Response.json({ message: "Incorrect login credentials", success: false });
}
