"use client";

import { FormikErrors } from "formik";
import { FC, FocusEventHandler, useState } from "react";
import useSWR from "swr";
import { useDebounceValue } from "usehooks-ts";
import { Spinner } from "./Spinner";

type Props = {
  placeholder: string;
  values: string[];
  setValues: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) =>
    | Promise<void>
    | Promise<
        FormikErrors<{
          username: string;
          password: string;
          venues: never[];
        }>
      >;
  error?: string;
  disable?: boolean;
  touched?: boolean;
  onBlur: FocusEventHandler<HTMLInputElement>;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const DEFAULT_DEBOUNCE_TIME = 500;

const Select: FC<Props> = ({
  values,
  setValues,
  error,
  disable = false,
  placeholder,
  touched,
  onBlur,
}) => {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const [debouncedValue] = useDebounceValue(value, DEFAULT_DEBOUNCE_TIME);

  const { data: results, isLoading } = useSWR<{
    candidates: Array<{
      place_id: string;
      formatted_address: string;
      name: string;
    }>;
  }>(() => {
    if (!debouncedValue) return null;
    return `/api/venues/?value=${debouncedValue}`;
  }, fetcher);

  return (
    <div>
      <div className="mb-2 relative">
        <input
          required
          type="text"
          name="venues"
          className="hidden"
          value={values}
          readOnly
        />
        <input
          id="venues"
          onBlur={(e) => {
            onBlur(e);
            setFocused(false);
          }}
          onFocus={() => setFocused(true)}
          disabled={disable}
          className="text-[16px] p-[10px] pl-[5px] block w-full border-b border-b-[#515151] bg-transparent focus:outline-none"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          type="text"
        />
        <span className="bar"></span>
        <label className="absolute pointer-events-none left-[5px] top-[10px] flex [&>*]:transition-transform">
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
      </div>
      {isLoading && <Spinner />}
      {results &&
        results.candidates.map((result) => (
          <button
            type="button"
            className="border border-black border-solid"
            key={result.place_id}
            onClick={() => {
              setValues(
                "venues",
                values.length
                  ? [...values, result.place_id]
                  : [result.place_id],
              );
              setValue("");
            }}
          >
            {result.name} ({result.formatted_address})
          </button>
        ))}
      {values.map((value, index) => (
        <div
          key={index}
          className="p-2 flex self-start items-center gap-2 bg-gray-800"
        >
          <span>{value}</span>
          <button
            type="button"
            onClick={() => {
              setValues(
                "venues",
                values.filter((v) => v !== value),
              );
            }}
          >
            x
          </button>
        </div>
      ))}
      {error && touched && <p className="text-red-500 italic">{error}</p>}
    </div>
  );
};

export default Select;
