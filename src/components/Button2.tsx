import { Button } from "@nextui-org/button";
import Link from "next/link";
import { FC, MouseEventHandler, ReactNode } from "react";

type Props = {
  children: ReactNode | string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  type?: "submit" | "reset" | "button" | undefined;
  disabled?: boolean;
  href?: string;
};

export const Button2: FC<Props> = ({
  children,
  onClick,
  className,
  type = "button",
  disabled = false,
  href,
}) => {
  return href ? (
    <Button
      as={Link}
      href={href}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`disabled:opacity-50 disabled:cursor-not-allowed bg-gray-800 text-white font-bold focus:outline-none ${className}`}
    >
      {children}
    </Button>
  ) : (
    <Button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`disabled:opacity-50 disabled:cursor-not-allowed bg-gray-800 text-white font-bold focus:outline-none ${className}`}
    >{children}</Button>
  );
};

export default Button2;
