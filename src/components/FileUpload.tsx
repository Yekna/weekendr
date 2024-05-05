"use client";
import { FC, useRef } from "react";
import { UploadDropzone } from "@/utils/uploadthing";
import { FormikErrors } from "formik";

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
};

const FileUpload: FC<Props> = ({ setFieldValue, error, touched }) => {
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
        />
      </div>
      {error && touched && <p className="text-red-500 italic">{error}</p>}
    </div>
  );
};

export default FileUpload;
