"use client";

import { Sidebar, SidebarContent } from "./ui/sidebar";
import Link from "./Link";
import { useSession } from "next-auth/react";

const MobileHeader = () => {
  const { data } = useSession();

  return (
    <Sidebar>
      <SidebarContent>
        <nav>
          <ul className="flex gap-3 flex-col text-sm">
            <li>
              <Link href="/">Home</Link>
            </li>
            {data?.user ? (
              <>
                <li>
                  <Link href="/profile">{data.user?.name}</Link>
                </li>
                <li>
                  <Link href="/api/auth/signout">Logout</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/following">Following</Link>
                </li>
                <li>
                  <Link href="/register">Register</Link>
                </li>
                <li>
                  <Link href="/login">Login</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </SidebarContent>
    </Sidebar>
  );
};

export default MobileHeader;
