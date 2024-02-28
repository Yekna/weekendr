"use client";

import { FC, ReactNode } from "react";
import { useFormStatus } from "react-dom";

type Props = {
  children: ReactNode | string;
  type?: "submit" | "reset" | "button" | undefined;
};

const Button: FC<Props> = ({ children, type = "button" }) => {
  const { pending } = useFormStatus();

  return (
    <button
      disabled={pending}
      className="disabled:opacity-50 disabled:cursor-not-allowed bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none"
    >
      {children}
    </button>
  );
};

export default Button;
