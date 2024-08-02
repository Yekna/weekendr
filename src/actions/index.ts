"use server";
import { signIn } from "@/auth";

export const login = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  // TODO: add try and catch clauses
  await signIn("credentials", {
    username,
    password,
    // redirect: true,
    redirectTo: "/",
  });

  return { success: "Logged in!" };
};
