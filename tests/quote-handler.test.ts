import { describe, expect, it, vi } from "vitest";

import {
  handleQuoteRequest,
  type QuoteHandlerDependencies,
} from "@/lib/quote-handler";

const now = Date.parse("2026-08-24T16:00:00.000Z");

const validPayload = {
  customerName: "Marie Tremblay",
  company: "Swift Atelier",
  phone: "438-227-6337",
  email: "marie@example.ca",
  pickupAddress: "100 rue Sainte-Catherine O, Montréal",
  deliveryAddress: "200 avenue du Mont-Royal E, Montréal",
  deliveryDate: "2026-08-25",
  parcelType: "small_parcel",
  instructions: "Appeler à l’arrivée",
  language: "fr",
  website: "",
  startedAt: now - 5_000,
};

function request(body: unknown, headers: Record<string, string> = {}) {
  return new Request("http://localhost:3000/api/quote-requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "http://localhost:3000",
      "x-forwarded-for": "203.0.113.9",
      ...headers,
    },
    body: JSON.stringify(body),
  });
}

function dependencies(
  overrides: QuoteHandlerDependencies = {},
): QuoteHandlerDependencies {
  return {
    now: () => now,
    environment: {
      ALLOWED_ORIGINS: "http://localhost:3000",
      RATE_LIMIT_SALT: "12345678901234567890123456789012",
      RATE_LIMIT_MAX: "5",
      RATE_LIMIT_WINDOW_SECONDS: "900",
    },
    checkRateLimit: vi.fn().mockResolvedValue({
      allowed: true,
      retryAfter: 900,
    }),
    createQuote: vi.fn().mockResolvedValue("SX-20260824-ABC123"),
    logError: vi.fn(),
    ...overrides,
  };
}

describe("POST quote request handler", () => {
  it("creates a validated quote and returns only its public reference", async () => {
    const deps = dependencies();
    const response = await handleQuoteRequest(request(validPayload), deps);

    expect(response.status).toBe(201);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      reference: "SX-20260824-ABC123",
    });
    expect(deps.createQuote).toHaveBeenCalledWith(
      expect.objectContaining({
        customerName: "Marie Tremblay",
        email: "marie@example.ca",
      }),
    );
    expect(response.headers.get("cache-control")).toContain("no-store");
  });

  it("rejects invalid fields before touching the rate limiter", async () => {
    const deps = dependencies();
    const response = await handleQuoteRequest(
      request({ ...validPayload, email: "bad", status: "closed" }),
      deps,
    );
    const body = await response.json();

    expect(response.status).toBe(422);
    expect(body.code).toBe("validation_failed");
    expect(deps.checkRateLimit).not.toHaveBeenCalled();
    expect(deps.createQuote).not.toHaveBeenCalled();
  });

  it("silently accepts the honeypot without persisting a submission", async () => {
    const deps = dependencies();
    const response = await handleQuoteRequest(
      request({ ...validPayload, website: "spam.example" }),
      deps,
    );

    expect(response.status).toBe(202);
    await expect(response.json()).resolves.toEqual({
      ok: true,
      reference: null,
    });
    expect(deps.createQuote).not.toHaveBeenCalled();
  });

  it("returns Retry-After when the persistent limit is reached", async () => {
    const deps = dependencies({
      checkRateLimit: vi.fn().mockResolvedValue({
        allowed: false,
        retryAfter: 321,
      }),
    });
    const response = await handleQuoteRequest(request(validPayload), deps);

    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("321");
    expect(deps.createQuote).not.toHaveBeenCalled();
  });

  it("blocks cross-origin browser submissions", async () => {
    const deps = dependencies();
    const response = await handleQuoteRequest(
      request(validPayload, { Origin: "https://example.net" }),
      deps,
    );

    expect(response.status).toBe(403);
    expect(deps.createQuote).not.toHaveBeenCalled();
  });

  it("does not expose database failures", async () => {
    const logError = vi.fn();
    const deps = dependencies({
      createQuote: vi.fn().mockRejectedValue(new Error("secret database detail")),
      logError,
    });
    const response = await handleQuoteRequest(request(validPayload), deps);
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body).toEqual({ ok: false, code: "service_unavailable" });
    expect(JSON.stringify(body)).not.toContain("secret database detail");
    expect(logError).toHaveBeenCalledWith("quote_request_failed", {
      errorType: "Error",
    });
  });
});
