"use client";
import { FC, useState } from "react";
import Button from "./Button2";
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
    message: "One or more files are bigger than allowed for their type",
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
    handleBlur,
    touched,
    setTouched,
  } = useFormik({
    initialValues: {
      username: "",
      password: "",
      venues: [] as string[],
      taxPictures: [] as string[],
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
      <form
        className="flex flex-col gap-5 sm:mb-0 mb-20"
        onSubmit={handleSubmit}
      >
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
        <Select
          touched={touched.venues}
          onBlur={handleBlur}
          placeholder="Venue"
          error={errors.venues ? (errors.venues as string) : ""}
          disable={isValidating}
          values={values.venues}
          setValues={setFieldValue}
        />
        <FileUpload
          setTouched={setTouched}
          error={errors.taxPictures ? (errors.taxPictures as string) : ""}
          setFieldValue={setFieldValue}
          touched={touched.taxPictures}
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
