import { DefaultSession } from "next-auth";
import { JWT as NextAuthJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends NextAuthJWT {
    sub: string;
    iat: number;
    exp: number;
    jti?: string;
    [key: string]: string | number | undefined;
  }
}
