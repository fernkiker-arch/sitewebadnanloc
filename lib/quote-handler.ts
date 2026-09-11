import {
  createQuoteRequest,
  enforceRateLimit,
} from "@/lib/quote-repository";
import {
  getClientIdentifier,
  hashClientIdentifier,
  isAllowedOrigin,
  PayloadTooLargeError,
  positiveInteger,
  readLimitedJson,
} from "@/lib/security";
import {
  createQuoteRequestSchema,
  getMontrealToday,
  type QuoteRequestPayload,
} from "@/lib/validation";

const JSON_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  Vary: "Origin",
};

type RateLimitResult = Awaited<ReturnType<typeof enforceRateLimit>>;

export interface QuoteHandlerDependencies {
  createQuote?: (input: QuoteRequestPayload) => Promise<string>;
  checkRateLimit?: (
    identifierHash: string,
    options: { maximumRequests: number; windowSeconds: number },
  ) => Promise<RateLimitResult>;
  now?: () => number;
  environment?: {
    ALLOWED_ORIGINS?: string;
    RATE_LIMIT_SALT?: string;
    RATE_LIMIT_MAX?: string;
    RATE_LIMIT_WINDOW_SECONDS?: string;
  };
  logError?: (message: string, details: { errorType: string }) => void;
}

function json(payload: unknown, status: number, headers?: HeadersInit) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...JSON_HEADERS, ...headers },
  });
}

function fieldNames(error: { issues: Array<{ path: PropertyKey[] }> }) {
  return [
    ...new Set(
      error.issues
        .map((issue) => issue.path[0])
        .filter((path): path is string => typeof path === "string"),
    ),
  ];
}

export async function handleQuoteRequest(
  request: Request,
  dependencies: QuoteHandlerDependencies = {},
) {
  const environment = dependencies.environment ?? process.env;
  const now = dependencies.now ?? Date.now;
  const createQuote = dependencies.createQuote ?? createQuoteRequest;
  const checkRateLimit = dependencies.checkRateLimit ?? enforceRateLimit;
  const logError = dependencies.logError ?? console.error;

  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return json({ ok: false, code: "unsupported_media_type" }, 415);
  }

  if (!isAllowedOrigin(request, environment.ALLOWED_ORIGINS)) {
    return json({ ok: false, code: "origin_not_allowed" }, 403);
  }

  let rawBody: unknown;
  try {
    rawBody = await readLimitedJson(request);
  } catch (error) {
    const status = error instanceof PayloadTooLargeError ? 413 : 400;
    const code = status === 413 ? "payload_too_large" : "invalid_json";
    return json({ ok: false, code }, status);
  }

  const parsed = createQuoteRequestSchema(getMontrealToday(new Date(now()))).safeParse(
    rawBody,
  );

  if (!parsed.success) {
    return json(
      {
        ok: false,
        code: "validation_failed",
        fields: fieldNames(parsed.error),
      },
      422,
    );
  }

  const { website, startedAt, ...quote } = parsed.data;
  const elapsed = now() - startedAt;
  const looksAutomated =
    website.length > 0 || elapsed < 1_000 || elapsed > 24 * 60 * 60 * 1_000;

  if (looksAutomated) {
    return json({ ok: true, reference: null }, 202);
  }

  try {
    const salt = environment.RATE_LIMIT_SALT ?? "";
    const identifier = getClientIdentifier(request.headers);
    const identifierHash = hashClientIdentifier(identifier, salt);
    const maximumRequests = positiveInteger(
      environment.RATE_LIMIT_MAX,
      5,
      100,
    );
    const windowSeconds = positiveInteger(
      environment.RATE_LIMIT_WINDOW_SECONDS,
      900,
      86_400,
    );
    const limit = await checkRateLimit(identifierHash, {
      maximumRequests,
      windowSeconds,
    });

    if (!limit.allowed) {
      return json(
        { ok: false, code: "rate_limited", retryAfter: limit.retryAfter },
        429,
        { "Retry-After": String(limit.retryAfter) },
      );
    }

    const reference = await createQuote(quote);
    return json({ ok: true, reference }, 201);
  } catch (error) {
    logError("quote_request_failed", {
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
    return json({ ok: false, code: "service_unavailable" }, 503);
  }
}
