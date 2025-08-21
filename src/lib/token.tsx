import { createHmac } from "crypto";

// Mock JWT token
export function createMockToken(
  payload: Record<string, unknown>,
  secret = "dev-jwt-secret"
) {
  const header = { alg: "HS256", typ: "JWT" };
  const b64 = (obj: unknown) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");
  const data = `${b64(header)}.${b64(payload)}`;
  const sig = createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${sig}`;
}
