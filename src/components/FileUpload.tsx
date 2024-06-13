"use client";
import { FC, useRef } from "react";
import { UploadDropzone } from "@/utils/uploadthing";
import { FormikErrors, FormikTouched } from "formik";

type Props = {
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined,
  ) =>
    | Promise<void>
    | Promise<
        FormikErrors<{
          username: string;
          password: string;
          venues: never[];
          taxPictures: never[];
        }>
      >;
  error?: string;
  touched?: boolean;
  setTouched: (
    touched: FormikTouched<{
      username: string;
      password: string;
      venues: string[];
      taxPictures: string[];
    }>,
    shouldValidate?: boolean | undefined,
  ) =>
    | Promise<
        FormikErrors<{
          username: string;
          password: string;
          venues: string[];
          taxPictures: string[];
        }>
      >
    | Promise<void>;
};

const FileUpload: FC<Props> = ({
  setFieldValue,
  error,
  touched,
  setTouched,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div>
      <label>Tax returns:</label>
      <div ref={ref} id="dropzone">
        <UploadDropzone
          appearance={{
            container: { border: "2px dashed #fff" },
            label: { color: "#fff" },
          }}
          endpoint="imageUploader"
          onClientUploadComplete={(e) => {
            setFieldValue(
              "taxPictures",
              e.map(({ url }) => url),
            );
          }}
          onUploadError={() => {
            setTouched({
              taxPictures: true,
            });
          }}
        />
      </div>
      {error && touched && <p className="text-red-500 italic">{error}</p>}
    </div>
  );
};

export default FileUpload;
