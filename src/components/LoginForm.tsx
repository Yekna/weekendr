"use client";
import { useFormik, Formik } from "formik";
import { FC, useState } from "react";
import { z } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Input from "./Input2";
import Button from "./Button";
import { useRouter } from "next/navigation";

type Props = {};

const validationSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(3, { message: "Username needs to be at least 3 characters long" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(10, { message: "Password needs to be at least 10 characters long" }),
});

const Form: FC<Props> = ({}) => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const {
    handleSubmit,
    touched,
    handleBlur,
    isValidating,
    errors,
    values,
    handleChange,
    isValid,
    isSubmitting,
    dirty,
  } = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ username, password }) => {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { message, success } = await res.json();
      if (success) {
        router.push("/");
      } else {
        setMessage(message);
      }
    },
    validationSchema: toFormikValidationSchema(validationSchema),
  });

  return (
    <div className="w-full">
      <h1 className="mb-5 text-4xl tracking-wide font-bold">Login</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <Input
          touched={touched.username}
          onBlur={handleBlur}
          error={errors.username}
          required={true}
          type="text"
          name="username"
          value={values.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <Input
          touched={touched.password}
          onBlur={handleBlur}
          required={true}
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          placeholder="Password"
          error={errors.password}
        />
        <Button
          disabled={isValidating || !isValid || isSubmitting || !dirty}
          type="submit"
        >
          Login
        </Button>
        <p className="uppercase">{message}</p>
      </form>
    </div>
  );
};

export default Form;
