import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="z-50 fixed bottom-0 left-0 right-0 sm:static bg-gray-800 px-6 flex items-center justify-between h-16">
      <Link href="/">
        <Image
          priority={true}
          alt="Weekendr Logo"
          src="/logo.svg"
          width={50}
          height={50}
        />
      </Link>
      <nav>
        <ul className="flex gap-3 items-center sm:text-base text-sm">
          <li>
            <Link href="/following">Following</Link>
          </li>
          <li>
            <Link href="/register">Register</Link>
          </li>
          <li>
            <Link href="/login">Login</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
