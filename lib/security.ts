import { createHmac } from "node:crypto";

const MAX_BODY_BYTES = 20 * 1024;

export class PayloadTooLargeError extends Error {
  constructor() {
    super("Request body is too large");
    this.name = "PayloadTooLargeError";
  }
}

export async function readLimitedJson(
  request: Request,
  maximumBytes = MAX_BODY_BYTES,
): Promise<unknown> {
  const declaredLength = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(declaredLength) && declaredLength > maximumBytes) {
    throw new PayloadTooLargeError();
  }

  if (!request.body) {
    throw new SyntaxError("Missing request body");
  }

  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let totalBytes = 0;
  let body = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    totalBytes += value.byteLength;
    if (totalBytes > maximumBytes) {
      await reader.cancel();
      throw new PayloadTooLargeError();
    }

    body += decoder.decode(value, { stream: true });
  }

  body += decoder.decode();
  return JSON.parse(body) as unknown;
}

function normalizeOrigin(value: string) {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function isAllowedOrigin(
  request: Request,
  configuredOrigins = process.env.ALLOWED_ORIGINS ?? "",
) {
  const originHeader = request.headers.get("origin");
  if (!originHeader) {
    return true;
  }

  const origin = normalizeOrigin(originHeader);
  if (!origin) return false;

  const allowed = new Set(
    configuredOrigins
      .split(",")
      .map((item) => normalizeOrigin(item.trim()))
      .filter((item): item is string => Boolean(item)),
  );
  allowed.add(new URL(request.url).origin);

  return allowed.has(origin);
}

function cleanIdentifier(value: string) {
  return value.replace(/[^a-zA-Z0-9:.,_\-\[\]]/g, "").slice(0, 128);
}

export function getClientIdentifier(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const direct = headers.get("x-real-ip")?.trim();
  const address = forwarded || direct;

  if (address) {
    return `ip:${cleanIdentifier(address)}`;
  }

  const userAgent = cleanIdentifier(headers.get("user-agent") ?? "unknown");
  const language = cleanIdentifier(headers.get("accept-language") ?? "unknown");
  return `fallback:${userAgent}:${language}`.slice(0, 256);
}

export function hashClientIdentifier(identifier: string, salt: string) {
  if (salt.length < 32) {
    throw new Error("RATE_LIMIT_SALT must contain at least 32 characters");
  }

  return createHmac("sha256", salt).update(identifier).digest("hex");
}

export function positiveInteger(
  value: string | undefined,
  fallback: number,
  maximum: number,
) {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > maximum) {
    return fallback;
  }
  return parsed;
}
