"use client";

import { Venue } from "@prisma/client";
import { useSession } from "next-auth/react";
import useSWR, { mutate } from "swr";
import Button from "./Button2";
import { useLocalStorage } from "usehooks-ts";

export default function ProfileStatistics({ id }: { id: string }) {
  const [following, setFollowing] = useLocalStorage<string[]>("following", []);
  const session = useSession();
  const { data: venue } = useSWR<
    | (Venue & {
        owner: {
          username: string;
        };
        parties: Array<{ id: string }>;
      })
    | undefined
  >(`/api/venue?venue=${id}`, (url: string) =>
    fetch(url).then((res) => res.json()),
  );

  return (
    <>
      <div className="flex items-center space-x-4 mt-2">
        <span>
          <strong>{venue?.parties?.length ?? "|"}</strong> posts
        </span>
        <span>
          <strong>{venue?.followers ?? "|"}</strong> followers
        </span>
      </div>
      <div className="mt-4 flex gap-2 flex-wrap">
        {venue &&
          (!session.data ||
            session.data?.user?.name !== venue?.owner?.username) && (
            <Button
              onClick={async () => {
                mutate(
                  `/api/venue?venue=${id}`,
                  {
                    followers: "|",
                    posts: venue?.parties?.length,
                  },
                  false,
                );

                const res = await fetch("/api/venue", {
                  method: "PATCH",
                  body: JSON.stringify({
                    id: venue.id,
                    followers: venue.followers,
                    following,
                  }),
                });

                if (res.ok) {
                  mutate(`/api/venue?venue=${id}`).then(() =>
                    setFollowing((ids) =>
                      ids.length
                        ? following.find((f) => f === venue.id)
                          ? following.filter((f) => f !== venue.id)
                          : [...ids, venue.id]
                        : [venue.id],
                    ),
                  );
                } else {
                  console.log("kurcina");
                }
              }}
              className="rounded-lg"
            >
              {following.find((f) => f === venue?.id) ? "Following" : "Follow"}
            </Button>
          )}
        {venue &&
          session.data &&
          session.data.user?.name === venue?.owner?.username && (
            <Button
              href={`/${id}/create`}
              className="bg-gray-200 text-gray-700"
            >
              Create Party
            </Button>
          )}
      </div>
    </>
  );
}
