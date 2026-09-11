import { describe, expect, it } from "vitest";

import {
  createQuoteRequestSchema,
  getMontrealToday,
} from "@/lib/validation";

const validPayload = {
  customerName: "  Marie Tremblay  ",
  company: "",
  phone: "438-227-6337",
  email: "  MARIE@EXAMPLE.CA ",
  pickupAddress: "100 rue Sainte-Catherine O, Montréal",
  deliveryAddress: "200 avenue du Mont-Royal E, Montréal",
  deliveryDate: "2026-08-24",
  parcelType: "small_parcel",
  instructions: "  Appeler à l’arrivée.  ",
  language: "fr",
  website: "",
  startedAt: "1750000000000",
};

describe("quote request validation", () => {
  it("normalizes a valid browser payload", () => {
    const result = createQuoteRequestSchema("2026-08-24").parse(validPayload);

    expect(result).toMatchObject({
      customerName: "Marie Tremblay",
      company: undefined,
      email: "marie@example.ca",
      instructions: "Appeler à l’arrivée.",
      startedAt: 1_750_000_000_000,
    });
  });

  it("rejects malformed contact details and a past delivery date", () => {
    const result = createQuoteRequestSchema("2026-08-24").safeParse({
      ...validPayload,
      phone: "abc",
      email: "not-an-email",
      deliveryDate: "2026-08-23",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.path[0])).toEqual(
        expect.arrayContaining(["phone", "email", "deliveryDate"]),
      );
    }
  });

  it("rejects a date that matches the format but does not exist", () => {
    const result = createQuoteRequestSchema("2026-01-01").safeParse({
      ...validPayload,
      deliveryDate: "2026-02-31",
    });

    expect(result.success).toBe(false);
  });

  it("rejects extra fields to prevent mass assignment", () => {
    const result = createQuoteRequestSchema("2026-08-24").safeParse({
      ...validPayload,
      status: "closed",
    });

    expect(result.success).toBe(false);
  });
});

describe("Montreal calendar date", () => {
  it("uses the America/Toronto date instead of the server timezone", () => {
    expect(getMontrealToday(new Date("2026-01-02T03:30:00.000Z"))).toBe(
      "2026-01-01",
    );
  });
});
