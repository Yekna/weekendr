"use client";
import { ChangeEvent, FC, HTMLInputTypeAttribute, useState } from "react";

type Props = {
  error?: string;
  placeholder: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  name: string;
  required?: boolean;
  type?: HTMLInputTypeAttribute;
  disabled?: boolean;
};

const Input: FC<Props> = ({
  required = false,
  placeholder,
  value,
  onChange,
  name,
  type = "text",
  error,
  disabled = false,
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <input
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
        disabled={disabled}
        type={type}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        required={required}
        className="text-[16px] p-[10px] pl-[5px] block w-full border-b border-b-[#515151] bg-transparent focus:outline-none"
      />
      <span className="bar"></span>
      <label
        htmlFor={name}
        className="absolute pointer-events-none left-[5px] top-[10px] flex [&>*]:transition-transform"
      >
        {placeholder.split("").map((letter, index) => (
          <span
            key={letter + index}
            style={{
              transitionDelay: `${index * 30}ms`,
              transform:
                value || focused ? "translateY(-20px)" : "translateY(0)",
              fontSize: value || focused ? "14px" : "18px",
              color: value || focused ? "#5264ae" : "#999",
            }}
          >
            {letter}
          </span>
        ))}
      </label>
      {error && <p className="text-red-500 italic">{error}</p>}
    </div>
  );
};

export default Input;
