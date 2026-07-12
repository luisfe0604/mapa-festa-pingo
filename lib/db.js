import { Pool } from "pg";

const globalForPg = globalThis;

export const pool =
  globalForPg.pgPool ??
  new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });

if (process.env.NODE_ENV !== "production") {
  globalForPg.pgPool = pool;
}
