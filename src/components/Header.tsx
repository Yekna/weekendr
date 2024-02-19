import Image from "next/image";
import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-gray-800 px-6 flex items-center justify-between h-16">
      <Link href="/">
        <Image priority={true} alt="Weekendr Logo" src="logo.svg" width={50} height={50} />
      </Link>
      <nav>
        <ul>
          <li>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
