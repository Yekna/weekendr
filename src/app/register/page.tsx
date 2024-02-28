import Image from "next/image";
import { Metadata } from "next";
import Form2 from "@/components/Form2";

export const metadata: Metadata = {
  title: "Register",
  description: "Register your venue",
};

export default async function Register() {
  return (
    <main
      className="max-w-7xl grid grid-cols-2 place-items-center mx-auto gap-5"
      style={{ height: "calc(100vh - 64px)" }}
    >
      <Form2 />
      {/*TODO: maybe show a screenshot that shows the benefits of registering */}
      <Image
        src="/registration5.jpg"
        alt="Registration Image"
        width={600}
        height={0}
        className="sm:block hidden w-full pointer-events-none"
      />
    </main>
  );
}
