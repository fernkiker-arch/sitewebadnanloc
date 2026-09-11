import { describe, expect, it } from "vitest";

import {
  getClientIdentifier,
  hashClientIdentifier,
  isAllowedOrigin,
  PayloadTooLargeError,
  positiveInteger,
  readLimitedJson,
} from "@/lib/security";

describe("request body protection", () => {
  it("reads JSON under the byte limit", async () => {
    const request = new Request("http://localhost/api", {
      method: "POST",
      body: JSON.stringify({ ok: true }),
    });

    await expect(readLimitedJson(request, 100)).resolves.toEqual({ ok: true });
  });

  it("rejects JSON over the byte limit", async () => {
    const request = new Request("http://localhost/api", {
      method: "POST",
      body: JSON.stringify({ value: "a".repeat(100) }),
    });

    await expect(readLimitedJson(request, 20)).rejects.toBeInstanceOf(
      PayloadTooLargeError,
    );
  });
});

describe("origin and identifier protection", () => {
  it("allows the request origin and configured production origins", () => {
    const localRequest = new Request("http://localhost:3000/api", {
      headers: { Origin: "http://localhost:3000" },
    });
    const productionRequest = new Request("http://localhost:3000/api", {
      headers: { Origin: "https://swiftxpress.ca" },
    });

    expect(isAllowedOrigin(localRequest, "https://swiftxpress.ca")).toBe(true);
    expect(isAllowedOrigin(productionRequest, "https://swiftxpress.ca")).toBe(
      true,
    );
  });

  it("rejects an unrelated browser origin", () => {
    const request = new Request("https://swiftxpress.ca/api", {
      headers: { Origin: "https://example.net" },
    });

    expect(isAllowedOrigin(request, "https://swiftxpress.ca")).toBe(false);
  });

  it("extracts and hashes the first forwarded address without storing it", () => {
    const headers = new Headers({
      "x-forwarded-for": "203.0.113.9, 10.0.0.1",
    });
    const identifier = getClientIdentifier(headers);
    const hash = hashClientIdentifier(
      identifier,
      "12345678901234567890123456789012",
    );

    expect(identifier).toBe("ip:203.0.113.9");
    expect(hash).toMatch(/^[a-f0-9]{64}$/);
    expect(hash).not.toContain("203.0.113.9");
  });

  it("uses bounded positive environment values", () => {
    expect(positiveInteger("8", 5, 10)).toBe(8);
    expect(positiveInteger("999", 5, 10)).toBe(5);
    expect(positiveInteger("invalid", 5, 10)).toBe(5);
  });
});
