import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "~/server/db";
import { sendPasswordResetEmail } from "~/lib/email";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
    "http://127.0.0.1:3003",
    "http://localhost:*",
    "http://127.0.0.1:*",
  ],
  secret: process.env.BETTER_AUTH_SECRET || "repomind-secret-key-super-secure-32-chars-long-2026",
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    async sendResetPassword(data, request) {
      console.log(`[RepoMind Auth] Reset password link for ${data.user.email}: ${data.url}`);
      await sendPasswordResetEmail({
        to: data.user.email,
        resetUrl: data.url,
      });
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
