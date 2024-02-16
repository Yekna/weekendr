"use client";

import { FC, useMemo } from "react";
import { useMediaQuery } from "usehooks-ts";

type Props = {
  setId: (id: number) => void;
  id: number;
};

const Sidebar: FC<Props> = ({ id, setId }) => {
  const isSmallScreen = useMediaQuery("(max-width: 640px)");

  const test = useMemo(() => {
    if (!isSmallScreen) {
      return {
        top: 0,
      };
    }
    return {
      right: 0,
      top: "50%",
    };
  }, [isSmallScreen]);

  return (
    <aside
      style={{ display: id ? "block" : "none", ...test }}
      className="absolute left-0 bottom-0 bg-white"
    >
      <p>{id}</p>
      <button onClick={() => setId(0)}>x</button>
    </aside>
  );
};

export default Sidebar;
