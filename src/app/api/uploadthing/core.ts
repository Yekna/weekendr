import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getToken } from "next-auth/jwt";

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
// TODO: Figure out whether to just limit the max file size for videos for non premium users or just not allow them to upload videos
// TODO: maybe just change endpoint name on frontend based on token.premium value so that you don't need to give an error message if they try and upload a video. BUT MAYBE TEST IF THAT COULD WORK IN POSTMAN
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  // TODO: change endpoint name
  imageAndVideoUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 10 },
    video: { maxFileSize: "16MB", maxFileCount: 1 },
  })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req, files }) => {
      const token = await getToken({
        req,
        secret: process.env.AUTH_SECRET as string,
        secureCookie: process.env.NODE_ENV === "production",
        salt:
          process.env.NODE_ENV === "production"
            ? "__Secure-authjs.session-token"
            : "authjs.session-token",
      });

      // This code runs on your server before upload
      const user = await auth(req);

      if (
        !token?.premium &&
        files.find((file) => file.type.includes("video"))
      ) {
        throw new UploadThingError(
          "You do no have permission to upload videos. Please consider purchasing a premium plan",
        );
      }

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
  imageUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 10 },
  })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const user = await auth(req);

      // If you throw, the user will not be able to upload
      if (!user) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
