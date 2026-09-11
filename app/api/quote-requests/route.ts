import { handleQuoteRequest } from "@/lib/quote-handler";

export const runtime = "nodejs";
export const maxDuration = 10;

export async function POST(request: Request) {
  return handleQuoteRequest(request);
}
