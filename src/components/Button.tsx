"use client";

import { FC, MouseEventHandler, ReactNode } from "react";

type Props = {
  children: ReactNode | string;
  type?: "submit" | "reset" | "button" | undefined;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
};

const Button: FC<Props> = ({
  children,
  type = "button",
  disabled = false,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`disabled:opacity-50 disabled:cursor-not-allowed bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
