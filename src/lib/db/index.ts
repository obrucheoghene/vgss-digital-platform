import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

// Disable prefetch as it's not supported for "Transaction" pool mode
const client = postgres(process.env.DATABASE_URL, {
  prepare: false,
  max: 10,
});

export const db = drizzle(client, { schema });
