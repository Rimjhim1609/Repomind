import { PrismaClient } from "@prisma/client";
import { env } from "~/env";

const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let client = globalForPrisma.prisma;

// Recreate client if it was cached as a dummy proxy or lacks modern auth models
if (!client || typeof (client as any).user?.findFirst !== "function") {
  try {
    client = createPrismaClient();
    if (env.NODE_ENV !== "production") {
      globalForPrisma.prisma = client;
    }
  } catch {
    client = new Proxy({}, {
      get: (_target, prop) => {
        if (prop === '$queryRaw') return async () => [];
        return new Proxy({}, {
          get: () => async () => null,
        });
      },
    }) as any;
  }
}

export const db = client as PrismaClient;
