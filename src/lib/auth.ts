// src/lib/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db";
import { users, type User } from "./db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Find user by email
          const user = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email as string))
            .limit(1);

          if (!user || user.length === 0) {
            return null;
          }

          const foundUser = user[0];

          // Check if account is deactivated
          if (foundUser.isDeactivated) {
            throw new Error(
              "Account has been deactivated. Please contact VGSS Office."
            );
          }

          // Verify password
          const passwordMatch = await bcrypt.compare(
            credentials.password as string,
            foundUser.password
          );

          if (!passwordMatch) {
            return null;
          }

          // Return user data for session
          return {
            id: foundUser.id,
            email: foundUser.email,
            name: foundUser.name,
            type: foundUser.type,
            accountStatus: foundUser.accountStatus,
            isDeactivated: foundUser.isDeactivated,
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      // Add user data to token on login
      if (user) {
        token.id = user.id;
        token.type = user.type;
        token.accountStatus = user.accountStatus;
        token.isDeactivated = user.isDeactivated;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user data to session
      if (token) {
        session.user.id = token.id as string;
        session.user.type = token.type as string;
        session.user.accountStatus = token.accountStatus as string;
        session.user.isDeactivated = token.isDeactivated as boolean;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Redirect users to their appropriate dashboard after login
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  trustHost: true,
});

// Utility function to hash passwords
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

// Utility function to verify if password needs to be changed (first login)
export const isDefaultPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare("VgssTemp123", hashedPassword);
};

// Auth helper functions
export const getServerSession = () => auth();

// Type definitions for NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      type: string;
      accountStatus: string;
      isDeactivated: boolean;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    type: string;
    accountStatus: string;
    isDeactivated: boolean;
  }
}
