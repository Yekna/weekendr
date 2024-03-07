import Parties from "@/components/Parties";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Following",
  description: "Venues you follow",
};

export default function Following() {
  return <Parties />;
}
