import crypto from "node:crypto";
import { headers } from "next/headers";
import { BETTER_AUTH_SECRET } from "@/config/env";
import { auth } from "./auth";

// Sign a short-lived HS256 JWT for Express backend verification (5 min TTL)
function signHS256Jwt(
  payload: Record<string, unknown>,
  secret: string,
): string {
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" }),
  ).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", secret)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

export async function getAuthFetchHeaders(
  includeJson = false,
): Promise<Record<string, string>> {
  const reqHeaders = await headers();
  const cookie = reqHeaders.get("cookie") || "";
  const result: Record<string, string> = {};

  if (includeJson) {
    result["Content-Type"] = "application/json";
  }
  if (cookie) {
    result.cookie = cookie;
  }

  const secret = BETTER_AUTH_SECRET;
  if (secret) {
    const session = await auth.api.getSession({ headers: reqHeaders });
    if (session?.user) {
      const now = Math.floor(Date.now() / 1000);
      const token = signHS256Jwt(
        {
          sub: session.user.id,
          email: session.user.email,
          name: session.user.name,
          role: session.user.role || "user",
          iat: now,
          exp: now + 300,
        },
        secret,
      );
      result.Authorization = `Bearer ${token}`;
    }
  }

  return result;
}
