"use client";

import Button from "@/components/Button2";
import Parties from "@/components/Parties2";
import { Party } from "@prisma/client";
import { ChangeEvent, useCallback, useRef, useState } from "react";
import useSWR from "swr";
import { useLocalStorage } from "usehooks-ts";
import toast from "react-hot-toast";

// TODO: implement an export following button
export default function Following() {
  const [ids, setIds] = useLocalStorage<string[]>("following", []);
  const [filterBy, setFilterBy] = useState("Week");

  const { data: parties } = useSWR<Array<Party & { Venue: { name: string } }>>(
    "/api/parties/",
    async (url: string) =>
      fetch(url, {
        method: "POST",
        body: JSON.stringify({ ids, filterBy }),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json()),
  );

  console.log({ parties });

  const handleExport = useCallback(() => {
    const blob = new Blob([JSON.stringify(ids)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `following.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [ids]);

  const handleImport = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        try {
          const json = JSON.parse(e.target.result as string);

          // Type guard to ensure data is an array of strings
          if (
            Array.isArray(json) &&
            json.every((item) => typeof item === "string")
          ) {
            setIds(json);
            toast.success("Data imported successfully!", {
              style: {
                borderRadius: "10px",
                background: "#333",
                color: "#fff",
              },
            });
          } else {
            toast.error("Invalid data format.");
          }
        } catch (err) {
          toast.error("Invalid JSON format.");
        }
      }
    };
    reader.readAsText(file);
  };

  const ref = useRef<HTMLInputElement>(null);

  return (
    <main style={{ minHeight: "calc(100dvh - 64px)" }}>
      <label htmlFor="filterBy">Filter by: </label>
      <select
        id="filterBy"
        onChange={(e) => setFilterBy(e.target.value)}
        className="text-black p-2"
      >
        <option>Week</option>
        <option>Month</option>
        <option>Year</option>
      </select>
      <Button onClick={handleExport}>Export</Button>
      <Button onClick={() => ref.current && ref.current.click()}>Import</Button>
      <input
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleImport}
        ref={ref}
      />
      <Parties
        parties={parties}
        noPartiesPlaceholder={`There aren't any future events planned for the venues you follow this ${filterBy}.`}
      />
    </main>
  );
}
