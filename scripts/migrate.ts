import "dotenv/config";

import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { Pool } from "pg";

function databaseSsl() {
  if (process.env.DATABASE_SSL !== "true") {
    return undefined;
  }

  return {
    rejectUnauthorized:
      process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== "false",
  };
}

async function migrate() {
  const connectionString =
    process.env.DATABASE_ADMIN_URL ?? process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_ADMIN_URL or DATABASE_URL must be configured");
  }

  const pool = new Pool({
    connectionString,
    ssl: databaseSsl(),
    max: 1,
    connectionTimeoutMillis: 5_000,
    statement_timeout: 30_000,
    application_name: "swiftxpress_migrations",
  });

  const client = await pool.connect();

  try {
    await client.query(
      "select pg_advisory_lock(hashtext('swiftxpress_schema_migrations'))",
    );
    await client.query(`
      create table if not exists schema_migrations (
        filename text primary key,
        checksum text not null,
        applied_at timestamptz not null default now()
      )
    `);

    const migrationsDirectory = path.resolve(process.cwd(), "migrations");
    const filenames = (await readdir(migrationsDirectory))
      .filter((filename) => /^\d+_[a-z0-9_]+\.sql$/.test(filename))
      .sort();

    for (const filename of filenames) {
      const sql = await readFile(path.join(migrationsDirectory, filename), "utf8");
      const checksum = createHash("sha256").update(sql).digest("hex");
      const existing = await client.query<{ checksum: string }>(
        "select checksum from schema_migrations where filename = $1",
        [filename],
      );

      if (existing.rowCount) {
        if (existing.rows[0]?.checksum !== checksum) {
          throw new Error(
            `Applied migration ${filename} has been modified; create a new migration instead`,
          );
        }

        console.log(`skip  ${filename}`);
        continue;
      }

      await client.query("begin");
      try {
        await client.query(sql);
        await client.query(
          "insert into schema_migrations (filename, checksum) values ($1, $2)",
          [filename, checksum],
        );
        await client.query("commit");
        console.log(`apply ${filename}`);
      } catch (error) {
        await client.query("rollback");
        throw error;
      }
    }
  } finally {
    try {
      await client.query(
        "select pg_advisory_unlock(hashtext('swiftxpress_schema_migrations'))",
      );
    } finally {
      client.release();
      await pool.end();
    }
  }
}

migrate().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown migration error";
  console.error(`Migration failed: ${message}`);
  process.exitCode = 1;
});
