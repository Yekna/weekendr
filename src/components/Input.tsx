"use client";
import { FC, HTMLInputTypeAttribute, KeyboardEventHandler } from "react";

type Props = {
  name: string;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
  onChange?: (value: string) => void;
  value: string;
  onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
};

const Input: FC<Props> = ({
  name,
  placeholder,
  type = "text",
  onChange,
  value,
  onKeyDown,
}) => {
  return (
    <input
      value={value}
      placeholder={placeholder}
      name={name}
      className="border border-gray-300 p-2 rounded-md text-black disabled:cursor-not-allowed"
      type={type}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
    />
  );
};

export default Input;
