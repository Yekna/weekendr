import { Metadata } from "next";
import Image from "next/image";
import LoginForm from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to control your venues at Weekendr",
};

export default function Login() {
  return (
    <main
      className="max-w-7xl grid sm:grid-cols-2 place-items-center mx-auto gap-5 px-5"
      style={{ height: "calc(100dvh - 64px)" }}
    >
      <LoginForm />
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
