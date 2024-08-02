import { auth } from "@/auth";
import { Venue } from "@prisma/client";
import { Metadata } from "next";
import Link from "next/link";
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
      className="flex justify-center gap-5 flex-col items-center mx-auto max-w-[1280px] w-4/5"
    >
      <h1>Your Venues:</h1>
      {/* TODO: use something else for mobile */}
      <div className="card">
        {venues.map((venue) => (
          <Link
            className="group"
            href={`/${venue.slug}`}
            target="_blank"
            key={venue.id}
          >
            <span>
              {venue.name}{" "}
              <svg
                className="hidden group-hover:inline"
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M18.25 15.5a.75.75 0 0 1-.75-.75V7.56L7.28 17.78a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L16.44 6.5H9.25a.75.75 0 0 1 0-1.5h9a.75.75 0 0 1 .75.75v9a.75.75 0 0 1-.75.75Z"></path>
              </svg>
            </span>
          </Link>
        ))}
      </div>
    </main>
  );
}
