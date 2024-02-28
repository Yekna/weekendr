"use client";

const FileUpload = () => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataURL = reader.result;
      console.log(dataURL);
    };
    reader.readAsDataURL(e.target.files?.[0] as Blob);
  };

  return (
    <input
      type="file"
      name="taxReturns"
      onChange={handleFileChange}
      accept="image/*"
    />
  );
};

export default FileUpload;
