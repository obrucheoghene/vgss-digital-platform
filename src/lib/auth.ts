// src/lib/auth.ts - Updated with last login tracking
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./db";
import { users, type User } from "./db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: "credentials",
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // Find user by username
          const user = await db
            .select()
            .from(users)
            .where(eq(users.username, credentials.username as string))
            .limit(1);

          if (!user || user.length === 0) {
            console.error("[AUTH] No user found for username:", credentials.username);
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
            console.error("[AUTH] Password mismatch for username:", credentials.username);
            return null;
          }

          // Update last login timestamp
          await db
            .update(users)
            .set({
              lastLoginAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(users.id, foundUser.id));

          // Return user data for session
          return {
            id: foundUser.id,
            email: foundUser.username, // NextAuth requires email field; map username here
            name: foundUser.name,
            type: foundUser.type,
            accountStatus: foundUser.accountStatus,
            isDeactivated: foundUser.isDeactivated,
            lastLoginAt: new Date(), // Include in session
          };
        } catch (error) {
          console.error("[AUTH] Authentication error:", error);
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
        token.username = user.email; // email field carries the username value
        token.type = user.type;
        token.accountStatus = user.accountStatus;
        token.isDeactivated = user.isDeactivated;
        token.lastLoginAt = user.lastLoginAt;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user data to session
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.type = token.type as string;
        session.user.accountStatus = token.accountStatus as string;
        session.user.isDeactivated = token.isDeactivated as boolean;
        session.user.lastLoginAt = token.lastLoginAt as Date;
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

// Type definitions for NextAuth - UPDATED
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      username: string;
      name: string;
      type: string;
      accountStatus: string;
      isDeactivated: boolean;
      lastLoginAt?: Date;
    };
  }

  interface User {
    id: string;
    email: string; // NextAuth internal; carries the username value
    name: string;
    type: string;
    accountStatus: string;
    isDeactivated: boolean;
    lastLoginAt?: Date;
  }
}
