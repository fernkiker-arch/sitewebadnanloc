import "server-only";

import { attachDatabasePool } from "@vercel/functions";
import { Pool, type QueryResult, type QueryResultRow } from "pg";

declare global {
  var swiftXpressDatabasePool: Pool | undefined;
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured");
  }

  const maximumConnections = Number(process.env.DATABASE_POOL_MAX ?? "5");
  const pool = new Pool({
    connectionString,
    ssl:
      process.env.DATABASE_SSL === "true"
        ? {
            rejectUnauthorized:
              process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false",
          }
        : undefined,
    max:
      Number.isInteger(maximumConnections) && maximumConnections > 0
        ? Math.min(maximumConnections, 10)
        : 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 5_000,
    statement_timeout: 5_000,
    query_timeout: 6_000,
    application_name: "swiftxpress_web",
  });

  attachDatabasePool(pool);
  return pool;
}

export function getPool() {
  if (!globalThis.swiftXpressDatabasePool) {
    globalThis.swiftXpressDatabasePool = createPool();
  }

  return globalThis.swiftXpressDatabasePool;
}

export function query<Row extends QueryResultRow = QueryResultRow>(
  text: string,
  values: readonly unknown[] = [],
): Promise<QueryResult<Row>> {
  return getPool().query<Row>(text, [...values]);
}
