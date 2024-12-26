
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import NextAuth from "next-auth/next";
import CredentialsProvider from 'next-auth/providers/credentials';

const prisma = new PrismaClient()

export const authOptions = {
    providers: [
      CredentialsProvider({
        name: 'Credentials',
        credentials: {
          email: { label: 'Email ', type: 'text', placeholder: 'john@doe.com' },
          password: { label: 'Password', type: 'password' },
        },
        async authorize(credentials, req) {
          if (!credentials) return null;
  
          let user = null;
          try {
            const isEmail = credentials.identifier.includes('@');
  
            if (isEmail) {
              user = await prisma.user.findUnique({
                where: { email: credentials.identifier },
              });
            } else {
              user = await prisma.user.findUnique({
                where: { phone: credentials.identifier },
              });
            }
  
            if (user && (await bcrypt.compare(credentials.password, user.password))) {
              return {
                id: user.id,
                phone: user.phone,
                name: user.name,
                email: user.email,
                role: user.role,
              };
            } else {
              throw new Error('อีเมล เบอร์โทร หรือ รหัสผ่านไม่ถูกต้อง');
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
    updateAge: 10, // รีเฟรชทุก 10 วินาที
      strategy: 'jwt',
    },
    cookies: {
      sessionToken: {
        name: process.env.NODE_ENV === "production"
          ? "__Secure-next-auth.session-token"
          : "next-auth.session-token",
        options: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        },
      },
    },
    debug: true,
    callbacks: {
      jwt: async ({ token, user }) => {
        if (user) {
          token.id = user.id;
          token.role = user.role;
          token.phone = user.phone;
        }
        console.log("JWT Callback Token:", token);  // ตรวจสอบว่า token ถูกต้อง
        return token;
      },
      session: async ({ session, token }) => {
        console.log("Session Callback Token:", token); // เพิ่ม log เพื่อตรวจสอบว่า token ถูกส่งมาหรือไม่
        if (token && session.user) {
          session.user.id = token.id;
          session.user.role = token.role;
          session.user.phone = token.phone;
        }
        console.log("Session Callback Session:", session);  // ตรวจสอบว่า session ถูกต้อง
        return session;
      }
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
  
  const handler = NextAuth(authOptions)
  
  export { handler as GET, handler as POST };

