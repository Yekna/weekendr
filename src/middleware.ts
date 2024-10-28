import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "./auth";

export async function middleware(request: NextRequest) {
  // check if user is logged in
  const session = await auth();
  if (!session) return NextResponse.redirect(new URL("/login", request.url));

  // check if the route is /:path/create and redirect user to /:path if their session username isn't associated with the :path slug
  if (request.nextUrl.pathname.includes("/create")) {
    const slug = request.nextUrl.pathname.split("/")[1];
    const data = await fetch(
      `${process.env.WEBSITE_URL}/api/venue?venue=${slug}`,
    ).then((res) => res.json());

    if (!data) return NextResponse.redirect(new URL("/", request.url));
    if (data?.owner?.username !== session.user?.name)
      return NextResponse.redirect(
        new URL(`/${request.nextUrl.pathname.split("/")[1]}`, request.url),
      );
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/:path/create", "/profile"],
};
