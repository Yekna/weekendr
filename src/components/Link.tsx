import Link from "next/link";
import { useSidebar } from "./ui/sidebar";
import { ReactNode } from "react";

const CustomLink = ({
  children,
  href,
}: {
  children: ReactNode;
  href: string;
}) => {
  const { closeOnLinkClick, toggleSidebar } = useSidebar();

  if (!closeOnLinkClick) {
    return <Link href={href}>{children}</Link>;
  }

  return (
    <Link onClick={toggleSidebar} href={href}>
      {children}
    </Link>
  );
};

export default CustomLink;
