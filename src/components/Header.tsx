import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";

const Header = async () => {
  const data = await auth();

  return (
    <header
      style={{ transition: "bottom 0.2s ease-in" }}
      className="z-50 fixed bottom-0 left-0 right-0 sm:static bg-gray-800 px-6 hidden sm:flex items-center justify-between h-16"
    >
      <Link href="/">
        <Image
          priority={true}
          alt="Weekendr Logo"
          src="/logo.png"
          width={120}
          height={48}
        />
      </Link>
      <nav>
        <ul className="flex gap-3 items-center sm:text-base text-sm">
          {data ? (
            <>
              <li>
                <Link href="/profile">{data?.user?.name}</Link>
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
    </header>
  );
};

export default Header;
