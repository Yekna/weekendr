"use client";
import { CSSProperties, ChangeEvent, FC, HTMLInputTypeAttribute } from "react";

type Props = {
  name: string;
  placeholder: string;
  type?: HTMLInputTypeAttribute;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  required?: boolean;
  error?: string;
  disabled?: boolean;
  style?: CSSProperties;
};

const Input: FC<Props> = ({
  name,
  placeholder,
  type = "text",
  onChange,
  value,
  required = false,
  error,
  disabled = false,
  style,
}) => {
  return (
    <>
      <input
        style={style}
        disabled={disabled}
        required={required}
        value={value}
        placeholder={placeholder}
        name={name}
        className="border border-gray-300 p-2 rounded-md text-black disabled:cursor-not-allowed outline-none shadow-2xl"
        type={type}
        onChange={onChange}
      />
      {error && <p className="text-red-500 italic">{error}</p>}
    </>
  );
};

export default Input;
