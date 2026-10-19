import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

let resolvedDatabaseUrl: string | undefined;

// Robust search for .env file to ensure the working pooler URL is always used
const possiblePaths = [
  "C:/Users/HP/.gemini/antigravity/scratch/Repomind/.env",
  path.resolve(process.cwd(), ".env"),
];

for (const p of possiblePaths) {
  try {
    if (fs.existsSync(p)) {
      const parsed = dotenv.parse(fs.readFileSync(p));
      if (parsed.DATABASE_URL) {
        resolvedDatabaseUrl = parsed.DATABASE_URL;
        process.env.DATABASE_URL = parsed.DATABASE_URL;
        break;
      }
    }
  } catch {}
}

if (!resolvedDatabaseUrl) {
  resolvedDatabaseUrl = process.env.DATABASE_URL;
}

const createPrismaClient = () =>
  new PrismaClient({
    datasourceUrl: resolvedDatabaseUrl,
    datasources: resolvedDatabaseUrl
      ? {
          db: {
            url: resolvedDatabaseUrl,
          },
        }
      : undefined,
    log:
      process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  prismaUrl: string | undefined;
};

// Recreate client if url does not match or client is not initialized
let client = globalForPrisma.prisma;
if (!client || globalForPrisma.prismaUrl !== resolvedDatabaseUrl) {
  client = createPrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
    globalForPrisma.prismaUrl = resolvedDatabaseUrl;
  }
}

export const db = client as PrismaClient;
