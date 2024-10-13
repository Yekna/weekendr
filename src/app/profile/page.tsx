import { auth } from "@/auth";
import ProfileFilter from "@/components/ProfileFilter";
import { Venue } from "@prisma/client";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Profile",
  description: "The place where you find all your registered venues",
};

export default async function Profile() {
  const session = await auth();

  // TODO: use middleware instead
  if (!session || !session.user) {
    redirect("/");
  }

  const { venues }: { venues: Array<Venue> } = await fetch(
    `${process.env.WEBSITE_URL}/api/owner`,
    {
      method: "POST",
      body: JSON.stringify({ username: session.user.name }),
      headers: {
        "Content-Type": "application/json",
      },
    },
  ).then((res) => res.json());

  return (
    <main
      style={{ minHeight: "calc(100dvh - 64px)" }}
      className="mx-auto max-w-[1280px] w-4/5 pt-3"
    >
      <ProfileFilter venues={venues} />
    </main>
  );
}
