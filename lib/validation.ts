import { z } from "zod";

const phonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[0-9 ()\-.]{5,24}$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function isCalendarDate(value: string) {
  if (!datePattern.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

const requiredText = (minimum: number, maximum: number) =>
  z.string().trim().min(minimum).max(maximum);

const optionalText = (maximum: number) =>
  z
    .string()
    .trim()
    .max(maximum)
    .transform((value) => (value.length ? value : undefined))
    .optional();

export const parcelTypes = [
  "envelope",
  "small_parcel",
  "medium_parcel",
  "large_parcel",
  "multiple_items",
  "other",
] as const;

export function getMontrealToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

export function createQuoteRequestSchema(minimumDate = getMontrealToday()) {
  return z
    .object({
      customerName: requiredText(2, 120),
      company: optionalText(120),
      phone: z.string().trim().min(7).max(32).regex(phonePattern),
      email: z.string().trim().toLowerCase().email().max(254),
      pickupAddress: requiredText(5, 240),
      deliveryAddress: requiredText(5, 240),
      deliveryDate: z
        .string()
        .refine(isCalendarDate)
        .refine((value) => value >= minimumDate),
      parcelType: z.enum(parcelTypes),
      instructions: optionalText(1000),
      language: z.enum(["fr", "en"]),
      website: z.string().max(200).optional().default(""),
      startedAt: z.coerce.number().int().positive(),
    })
    .strict();
}

export type QuoteRequestInput = z.output<
  ReturnType<typeof createQuoteRequestSchema>
>;

export type QuoteRequestPayload = Omit<
  QuoteRequestInput,
  "website" | "startedAt"
>;
