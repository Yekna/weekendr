import Image from "next/image";
import { Metadata } from "next";
import Form from "@/components/Form";

export const metadata: Metadata = {
  title: "Register",
  description: "Register your venue",
};

export default async function Register() {
  return (
    <main
      className="max-w-7xl grid sm:grid-cols-2 place-items-center mx-auto gap-5 px-5"
      style={{ height: "calc(100dvh - 64px)" }}
    >
      <Form />
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
