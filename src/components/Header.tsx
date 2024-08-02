import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";

const Header = async () => {
  const session = await auth();
  return (
    <header className="z-50 fixed bottom-0 left-0 right-0 sm:static bg-gray-800 px-6 flex items-center justify-between h-16">
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
          {session ? (
            <>
              <li>
                <Link href="/profile">{session.user?.name}</Link>
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
