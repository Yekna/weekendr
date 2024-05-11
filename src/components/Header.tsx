import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="z-50 fixed bottom-0 left-0 right-0 sm:static bg-gray-800 px-6 flex items-center justify-between h-16">
      <Link href="/">
        <Image
          priority={true}
          alt="Weekendr Logo"
          src="logo.svg"
          width={50}
          height={50}
        />
      </Link>
      <nav>
        <ul className="flex gap-3 items-center">
          <li>
            <Link href="/following">
              <Image
                alt="Following"
                src="/following.svg"
                width={50}
                height={50}
              />
            </Link>
          </li>
          <li>
            <Link href="/register">
              <Image
                alt="Register"
                src="/register.svg"
                width={50}
                height={50}
              />
            </Link>
          </li>
          <li>
            <Link href="/login">
              <Image alt="Login" src="/login.svg" width={50} height={50} />
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
