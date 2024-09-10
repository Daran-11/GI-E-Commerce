import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Phone or Email ",
          type: "text",
          placeholder: "john@doe.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;

        let user = null;
        try {
          const isEmail = credentials.identifier.includes("@");

          if (isEmail) {
            user = await prisma.user.findUnique({
              where: { email: credentials.identifier },
            });
          } else {
            user = await prisma.user.findUnique({
              where: { phone: credentials.identifier },
            });
          }

          if (
            user &&
            (await bcrypt.compare(credentials.password, user.password))
          ) {
            return {
              id: user.id,
              phone: user.phone,
              name: user.name,
              email: user.email,
              role: user.role,
            };
          } else {
            throw new Error("Invalid email or password");
          }
        } catch (error) {
          if (error.message.includes("Can't reach database server")) {
            throw new Error("Unable to connect to server");
          }
          throw new Error(error.message);
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    // Set session timeout (maxAge) to 30 days (in seconds)
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    // Set session update interval (updateAge) to 1 day (in seconds)
    updateAge: 24 * 60 * 60, // 1 day in seconds
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
