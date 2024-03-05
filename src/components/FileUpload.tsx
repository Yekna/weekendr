"use client";
import { FC } from "react";
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
};

const FileUpload: FC<Props> = ({ setFieldValue, error }) => {
  return (
    <>
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
      {error && <p className="text-red-500 italic">{error}</p>}
    </>
  );
};

export default FileUpload;
