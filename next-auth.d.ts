import { DefaultUser } from "next-auth";

declare module "next-auth/jwt" {
  interface JWT {
    id?: string; // Custom field
    role?: string; // Custom role field
    accessToken?: string; // Store access token
    premium: boolean;
    // Add more custom properties here
  }
}

declare module "next-auth" {
  interface User extends DefaultUser {
    premium: boolean;
  }
}
