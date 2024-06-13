"use client";

import { Genre, Venue } from "@prisma/client";
import { useFormik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import z from "zod";
import Input from "@/components/Input2";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import RadioButton from "@/components/RadioButton";
import { useParams } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";
import { Spinner } from "@/components/Spinner";
import Button from "@/components/Button2";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const validationSchema = z.object({
  name: z.string({ required_error: "Name for party is required" }).min(3, {
    message: "Name for party needs to be at least 3 characters long",
  }),
  tags: z.string().optional(),
  genre: z.nativeEnum(Genre),
  picture: z.string().url(),
  date: z.string({ required_error: "Please choose a date for the party" }),
});

export default function CreateParty() {
  const [message, setMessage] = useState("");
  const { id } = useParams<{ id: string }>();
  const { data } = useSWR<{ venue: Venue }>(`/api/venue?venue=${id}`, fetcher);

  const {
    handleSubmit,
    touched,
    handleBlur,
    errors,
    values,
    handleChange,
    isValidating,
    setFieldValue,
    isValid,
    dirty,
    setFieldError,
    setTouched,
  } = useFormik({
    initialValues: {
      name: "",
      tags: "",
      genre: Object.keys(Genre)[0],
      picture: "",
      date: "",
      venueId: id,
    },
    onSubmit: async ({ name, tags, genre, picture, date, venueId }) => {
      const { message } = await fetch("/api/party", {
        method: "POST",
        body: JSON.stringify({ name, tags, genre, picture, date, venueId }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res.json());
      setMessage(message);
    },
    validationSchema: toFormikValidationSchema(validationSchema),
  });

  if (data?.venue === null) {
    return <main>Sorry that venue doesn&apos;t seem to exist</main>;
  } else if (data === undefined) {
    return <Spinner />;
  }

  return (
    <main
      className="max-w-7xl grid sm:grid-cols-2 place-items-center mx-auto gap-5 px-5"
      style={{ minHeight: "calc(100dvh - 64px)" }}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
        <Input
          touched={touched.name}
          onBlur={handleBlur}
          error={errors.name}
          required={true}
          name="name"
          value={values.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <Input
          touched={touched.tags}
          onBlur={handleBlur}
          error={errors.tags as string}
          name="tags"
          value={values.tags}
          onChange={handleChange}
          placeholder="Tags (Separate by comma, optional)"
        />
        <input
          name="date"
          type="datetime-local"
          value={values.date}
          onBlur={() => setTouched({ date: true })}
          onChange={handleChange}
          className="px-[5px] bg-transparent shadow border-b border-b-[#515151] focus:outline-none focus:shadow-outline"
        />
        {errors.date && touched.date && (
          <p className="text-red-500 italic">{errors.date}</p>
        )}
        <div>
          <h2>Genre:</h2>
          <section className="radio-inputs overflow-scroll">
            {Object.keys(Genre).map((genre) => (
              <RadioButton
                genre={genre}
                value={values.genre}
                onChange={handleChange}
                key={genre}
              />
            ))}
          </section>
        </div>
        <UploadButton
          className="items-start"
          endpoint="imageUploader"
          onClientUploadComplete={(e) => {
            setTouched({ picture: true });
            setFieldValue("picture", e[0].url);
          }}
          content={{
            button() {
              return "Choose party banner";
            },
          }}
          appearance={{
            button: "w-auto px-4",
          }}
          config={{ mode: "auto" }}
          onUploadError={() => {
            setTouched({ picture: true });
            setFieldError(
              "picture",
              "One or more files are bigger than allowed for their type",
            );
          }}
        />
        {errors.picture && touched.picture && (
          <p className="text-red-500 italic">
            Max Image Size is 4MB. Please choose a different image.
          </p>
        )}
        {!errors.picture && touched.picture && (
          <p className="text-[#5264ae] italic">
            Successfully Uploaded Image :)
          </p>
        )}
        <input
          type="text"
          className="hidden"
          name="venueId"
          defaultValue={id}
        />
        <Button disabled={!isValid || !dirty} type="submit">
          Create Party
        </Button>
        {message && <p>{message}</p>}
      </form>
      <Image
        src="/registration3.jpg"
        alt="Registration Image"
        width={600}
        height={0}
        className="sm:block hidden w-full pointer-events-none"
      />
    </main>
  );
}
