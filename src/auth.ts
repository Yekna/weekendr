import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "../prisma/client";

export const BASE_PATH = "/api/auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const { username, password } = credentials as Record<
          "username" | "password",
          string
        >;
        const owner = await prisma.owner.findFirst({
          where: {
            username,
          },
        });
        if (owner && bcrypt.compareSync(password, owner.password)) {
          return { name: owner.username };
        }
        return null;
      },
    }),
  ],
  basePath: BASE_PATH,
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
  },
});
