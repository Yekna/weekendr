"use client";
import { FC, useState } from "react";
import Input from "./Input";
import Button from "./Button";
import Select from "./Select";

type Props = {};

const Form: FC<Props> = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [venues, setVenues] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  return (
    <div className="w-full">
      <h1 className="mb-5 text-4xl tracking-wide font-bold">
        Stand Out From The Crowd. <br />
        Register your venue.
      </h1>
      <form
        className="flex flex-col gap-5"
        onSubmit={async (e) => {
          e.preventDefault();
          const res = await fetch("/api/venue", {
            method: "POST",
            body: JSON.stringify({ username, password, venues }),
            headers: {
              "Content-Type": "application/json",
            },
          });
          const { message } = await res.json();
          setMessage(message);
        }}
      >
        <Input
          type="text"
          name="username"
          value={username}
          onChange={setUsername}
          placeholder="Username"
        />
        <Input
          type="password"
          name="password"
          value={password}
          onChange={setPassword}
          placeholder="Password"
        />
        <Select values={venues} setValues={setVenues} />
        <Button>Register</Button>
        <p className="uppercase">{message}</p>
      </form>
    </div>
  );
};

export default Form;