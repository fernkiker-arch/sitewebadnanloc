import "dotenv/config";

import { Pool } from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const runDatabaseTests = process.env.RUN_DATABASE_TESTS === "true";

describe.runIf(runDatabaseTests)("PostgreSQL integration", () => {
  let applicationPool: Pool;
  let ownerPool: Pool;
  let reference: string | undefined;

  beforeAll(() => {
    if (!process.env.DATABASE_URL || !process.env.DATABASE_ADMIN_URL) {
      throw new Error(
        "DATABASE_URL and DATABASE_ADMIN_URL are required for database tests",
      );
    }

    applicationPool = new Pool({ connectionString: process.env.DATABASE_URL });
    ownerPool = new Pool({ connectionString: process.env.DATABASE_ADMIN_URL });
  });

  afterAll(async () => {
    if (reference) {
      await ownerPool.query("delete from quote_requests where reference = $1", [
        reference,
      ]);
    }
    await Promise.all([applicationPool.end(), ownerPool.end()]);
  });

  it("persists a quote through the restricted role and applies defaults", async () => {
    const inserted = await applicationPool.query<{ reference: string }>(
      `
        insert into quote_requests (
          customer_name,
          company,
          phone,
          email,
          pickup_address,
          delivery_address,
          delivery_date,
          parcel_type,
          additional_instructions,
          language
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        returning reference
      `,
      [
        "Database Test",
        null,
        "438-555-0100",
        "database-test@example.ca",
        "100 rue Test, Montréal",
        "200 rue Test, Montréal",
        "2099-12-31",
        "envelope",
        null,
        "fr",
      ],
    );

    reference = inserted.rows[0]?.reference;
    expect(reference).toMatch(/^SX-\d{8}-[A-F0-9]{10}$/);

    const stored = await ownerPool.query<{
      id: string;
      status: string;
      created_at: Date;
      updated_at: Date;
    }>(
      `
        select id, status, created_at, updated_at
        from quote_requests
        where reference = $1
      `,
      [reference],
    );

    expect(stored.rows[0]?.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(stored.rows[0]?.status).toBe("new");
    expect(stored.rows[0]?.created_at).toBeInstanceOf(Date);
    expect(stored.rows[0]?.updated_at).toBeInstanceOf(Date);
  });

  it("prevents the application role from reading submission details", async () => {
    await expect(
      applicationPool.query("select customer_name from quote_requests limit 1"),
    ).rejects.toMatchObject({ code: "42501" });
  });
});
