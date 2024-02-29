"use client";

import { Dispatch, FC, SetStateAction, useState } from "react";
import useSWR from "swr";
import { useDebounceValue } from "usehooks-ts";

type Props = {
  values: string[];
  setValues: Dispatch<SetStateAction<string[]>>;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const DEFAULT_DEBOUNCE_TIME = 500;

const Select: FC<Props> = ({ values, setValues }) => {
  const [value, setValue] = useState("");
  const [debouncedValue] = useDebounceValue(value, DEFAULT_DEBOUNCE_TIME);

  const { data: results } = useSWR<{
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
    <>
      <div className="flex flex-wrap gap-2 bg-white rounded-md overflow-hidden border border-gray-300">
        {values.map((value, index) => (
          <div key={index} className="p-2 flex items-center gap-2 bg-gray-800">
            <span>{value}</span>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setValues(values.filter((v) => v !== value));
              }}
            >
              x
            </button>
          </div>
        ))}
        <input
          required
          type="text"
          name="venues"
          className="hidden"
          value={values}
          readOnly
        />
        <input
          placeholder="Venue name"
          className="text-black flex-grow p-2 disabled:cursor-not-allowed"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          type="text"
        />
      </div>
      {results &&
        results.candidates.map((result) => (
          <button
            type="button"
            className="border border-black border-solid"
            key={result.place_id}
            onClick={(e) => {
              e.preventDefault();
              setValues((v) => [...v, result.place_id]);
              setValue("");
              // setResults([]);
            }}
          >
            {result.name} ({result.formatted_address})
          </button>
        ))}
    </>
  );
};

export default Select;
