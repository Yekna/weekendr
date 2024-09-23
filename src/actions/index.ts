"use server";
import { signIn } from "@/auth";

export const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  // TODO: implement rate limiting to prevent brute-force attacks
  await signIn("credentials", {
    username,
    password,
    redirectTo: "/",
  });
};
