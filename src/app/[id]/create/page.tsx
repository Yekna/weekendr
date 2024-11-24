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
  media: z.string().url().array(),
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
      media: [] as string[],
      date: "",
      venueId: id,
    },
    onSubmit: async ({ name, tags, genre, media, date, venueId }) => {
      const { message } = await fetch("/api/party", {
        method: "POST",
        body: JSON.stringify({ name, tags, genre, media, date, venueId }),
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
    <main className="max-w-7xl grid sm:grid-cols-2 place-items-center mx-auto gap-5 px-5 min-h-screen sm:min-h-[calc(100vh-64px)]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 w-full overflow-x-hidden"
      >
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
          placeholder="Tags (Optional, Separate by comma)"
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
          <label>Genre:</label>
          <section className="radio-inputs">
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
        <div>
          <span>Choose party banner:</span>
          <UploadButton
            className="uploadthing"
            endpoint="imageAndVideoUploader"
            onClientUploadComplete={(e) => {
              setTouched({ media: true });
              setFieldValue(
                "media",
                e.length > 1 ? e.map(({ url }) => url) : [e[0].url],
              );
            }}
            appearance={{
              button: "w-auto px-4",
            }}
            config={{ mode: "auto" }}
            onUploadError={(e) => {
              setTouched({ media: true }).then(() =>
                setFieldError("media", e.message),
              );
            }}
          />
          {errors.media && touched.media && (
            <p className="text-red-500 italic">{errors.media}</p>
          )}
          {!errors.media && touched.media && (
            <p className="text-[#5264ae] italic">
              Successfully Uploaded Image :)
            </p>
          )}
        </div>
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
