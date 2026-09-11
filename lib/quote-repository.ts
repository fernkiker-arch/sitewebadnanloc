import type { QueryResult, QueryResultRow } from "pg";

import { query } from "@/lib/db";
import type { QuoteRequestPayload } from "@/lib/validation";

export type QueryRunner = <Row extends QueryResultRow = QueryResultRow>(
  text: string,
  values?: readonly unknown[],
) => Promise<QueryResult<Row>>;

interface RateLimitRow extends QueryResultRow {
  request_count: number;
  retry_after: number;
}

export interface RateLimitOptions {
  maximumRequests: number;
  windowSeconds: number;
}

export async function enforceRateLimit(
  identifierHash: string,
  options: RateLimitOptions,
  runQuery: QueryRunner = query,
) {
  const result = await runQuery<RateLimitRow>(
    `
      insert into quote_rate_limits (
        identifier_hash,
        request_count,
        window_started_at,
        updated_at
      )
      values ($1, 1, now(), now())
      on conflict (identifier_hash) do update
      set
        request_count = case
          when quote_rate_limits.window_started_at <= now() - ($2 * interval '1 second')
            then 1
          else least(quote_rate_limits.request_count + 1, $3)
        end,
        window_started_at = case
          when quote_rate_limits.window_started_at <= now() - ($2 * interval '1 second')
            then now()
          else quote_rate_limits.window_started_at
        end,
        updated_at = now()
      returning
        request_count,
        greatest(
          1,
          ceil(extract(epoch from (
            window_started_at + ($2 * interval '1 second') - now()
          )))::integer
        ) as retry_after
    `,
    [identifierHash, options.windowSeconds, options.maximumRequests + 1],
  );

  const row = result.rows[0];
  if (!row) {
    throw new Error("Rate limit query returned no result");
  }

  return {
    allowed: row.request_count <= options.maximumRequests,
    retryAfter: row.retry_after,
  };
}

interface QuoteReferenceRow extends QueryResultRow {
  reference: string;
}

export async function createQuoteRequest(
  input: QuoteRequestPayload,
  runQuery: QueryRunner = query,
) {
  const result = await runQuery<QuoteReferenceRow>(
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
      input.customerName,
      input.company ?? null,
      input.phone,
      input.email,
      input.pickupAddress,
      input.deliveryAddress,
      input.deliveryDate,
      input.parcelType,
      input.instructions ?? null,
      input.language,
    ],
  );

  const reference = result.rows[0]?.reference;
  if (!reference) {
    throw new Error("Quote insert returned no reference");
  }

  return reference;
}
