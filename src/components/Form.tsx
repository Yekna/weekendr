"use client";
import { FC, useState } from "react";
import Button from "./Button";
import Select from "./Select2";
import { useFormik } from "formik";
import z from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";
import FileUpload from "./FileUpload";
import Input from "./Input2";

type Props = {};

const validationSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .min(3, { message: "Username needs to be at least 3 characters long" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(10, { message: "Password needs to be at least 10 characters long" }),
  venues: z
    .array(z.string().min(27))
    .min(1, { message: "At least 1 venue needs to be selected" }),
  taxPictures: z.array(z.string().url()).min(1, {
    message:
      "At least 1 picture needs to be sent of your tax returns. Once you've chosen your picture(s) click on 'Upload n file(s)'",
  }),
});

const Form: FC<Props> = () => {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    dirty,
    isValid,
    isValidating,
    setFieldValue,
  } = useFormik({
    initialValues: {
      username: "",
      password: "",
      venues: [],
      taxPictures: [],
    },
    onSubmit: async ({ username, password, venues, taxPictures }) => {
      const res = await fetch("/api/venue", {
        method: "POST",
        body: JSON.stringify({ username, password, venues, taxPictures }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { message } = await res.json();
      setMessage(message);
    },
    validationSchema: toFormikValidationSchema(validationSchema),
  });
  const [message, setMessage] = useState("");

  return (
    <div className="w-full">
      <h1 className="mb-5 text-4xl tracking-wide font-bold">
        Stand Out From The Crowd. <br />
        Register your venue.
      </h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <Input
          disabled={isValidating}
          error={errors.username}
          required={true}
          type="text"
          name="username"
          value={values.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <Input
          disabled={isValidating}
          required={true}
          type="password"
          name="password"
          value={values.password}
          onChange={handleChange}
          placeholder="Password"
          error={errors.password}
        />
        <Select
          placeholder="Venue"
          error={errors.venues ? (errors.venues as string) : ""}
          disable={isValidating}
          values={values.venues}
          setValues={setFieldValue}
        />
        <FileUpload
          error={errors.taxPictures ? (errors.taxPictures as string) : ""}
          setFieldValue={setFieldValue}
        />
        <Button
          disabled={isValidating || !isValid || isSubmitting || !dirty}
          type="submit"
        >
          Register
        </Button>
        <p className="uppercase">{message}</p>
      </form>
    </div>
  );
};

export default Form;
