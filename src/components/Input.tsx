"use client";
import {
  Dispatch,
  FC,
  HTMLInputTypeAttribute,
  SetStateAction,
} from "react";

type Props = {
  name: string;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
  onChange: Dispatch<SetStateAction<string>>;
  value: string;
};

const Input: FC<Props> = ({
  name,
  placeholder,
  type = "text",
  onChange,
  value,
}) => {
  return (
    <input
      value={value}
      placeholder={placeholder}
      name={name}
      className="border border-gray-300 p-2 rounded-md text-black disabled:cursor-not-allowed"
      type={type}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};

export default Input;
