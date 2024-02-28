"use client";

import {
  ChangeEventHandler,
  Dispatch,
  FC,
  KeyboardEvent,
  SetStateAction,
  useCallback,
  useRef,
  useState,
} from "react";
import Input from "./Input";

type Props = {
  values: string[];
  setValues: Dispatch<SetStateAction<string[]>>;
};

const Select2: FC<Props> = ({ values, setValues }) => {
  const [value, setValue] = useState("");
  const [results, setResults] = useState<
    Array<{ place_id: string; name: string; formatted_address: string }>
  >([]);
  const onKeyDown = useCallback(
    async (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const res = await fetch(`/api/venues/?value=${value}`);
        const { candidates } = await res.json();
        setResults(candidates || []);
        setValue("");
      }
    },
    [value],
  );

  return (
    <>
      <div className="flex flex-wrap gap-2 bg-white rounded-md p-1">
        {values.map((value, index) => (
          <div key={index} className="p-1 flex items-center gap-2 bg-gray-800">
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
          placeholder="Venue name (Press Enter)"
          className="text-black flex-grow p-2 disabled:cursor-not-allowed"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          type="text"
          onKeyDown={onKeyDown}
        />
      </div>
      {results.map((result) => (
        <button
          type="button"
          className="border border-black border-solid"
          key={result.place_id}
          onClick={(e) => {
            e.preventDefault();
            setValues((v) => [...v, result.place_id]);
            setResults([]);
          }}
        >
          {result.name} ({result.formatted_address})
        </button>
      ))}
    </>
  );
};

export default Select2;
