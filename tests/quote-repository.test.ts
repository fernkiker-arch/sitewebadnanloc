import type { QueryResult } from "pg";
import { describe, expect, it, vi } from "vitest";

import {
  createQuoteRequest,
  enforceRateLimit,
  type QueryRunner,
} from "@/lib/quote-repository";

function queryResult<Row extends Record<string, unknown>>(
  rows: Row[],
): QueryResult<Row> {
  return {
    command: "INSERT",
    rowCount: rows.length,
    oid: 0,
    fields: [],
    rows,
  };
}

describe("quote repository", () => {
  it("inserts form values through positional parameters", async () => {
    const runQuery = vi
      .fn()
      .mockResolvedValue(queryResult([{ reference: "SX-20260824-ABC123" }]));

    const reference = await createQuoteRequest(
      {
        customerName: "Marie Tremblay",
        company: undefined,
        phone: "438-227-6337",
        email: "marie@example.ca",
        pickupAddress: "100 rue A, Montréal",
        deliveryAddress: "200 rue B, Montréal",
        deliveryDate: "2026-08-24",
        parcelType: "small_parcel",
        instructions: undefined,
        language: "fr",
      },
      runQuery as unknown as QueryRunner,
    );

    expect(reference).toBe("SX-20260824-ABC123");
    const [sql, values] = runQuery.mock.calls[0] as [string, unknown[]];
    expect(sql).toContain("values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)");
    expect(sql).not.toContain("Marie Tremblay");
    expect(values).toEqual([
      "Marie Tremblay",
      null,
      "438-227-6337",
      "marie@example.ca",
      "100 rue A, Montréal",
      "200 rue B, Montréal",
      "2026-08-24",
      "small_parcel",
      null,
      "fr",
    ]);
  });

  it("atomically enforces the database-backed request limit", async () => {
    const runQuery = vi
      .fn()
      .mockResolvedValue(queryResult([{ request_count: 6, retry_after: 300 }]));

    const result = await enforceRateLimit(
      "a".repeat(64),
      { maximumRequests: 5, windowSeconds: 900 },
      runQuery as unknown as QueryRunner,
    );

    expect(result).toEqual({ allowed: false, retryAfter: 300 });
    const [sql, values] = runQuery.mock.calls[0] as [string, unknown[]];
    expect(sql).toContain("on conflict (identifier_hash) do update");
    expect(values).toEqual(["a".repeat(64), 900, 6]);
  });
});
