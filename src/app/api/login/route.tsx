import { NextResponse } from "next/server";
import { getUser, setSessionToken, setMfaCode } from "@/lib/authStore";
import { createMockToken } from "@/lib/token";
import { generateMfaCode } from "@/lib/mfa";

export async function POST(req: Request) {
  try {
    const { username, hashedPassword, secureWord, expired } = await req.json();

    if (!username || !hashedPassword || !secureWord) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const now = Date.now();

    // Validate Wecure Word
    if (!secureWord) {
      return NextResponse.json(
        { error: "No secure word requested" },
        { status: 400 }
      );
    }
    if (expired) {
      return NextResponse.json(
        { error: "Secure word expired" },
        { status: 400 }
      );
    }

    // Issue a mock session token
    const token = createMockToken({
      sub: username,
      iat: Math.floor(now / 1000),
      exp: Math.floor((now + 60 * 60 * 1000) / 1000), // 1 hour
    });
    setSessionToken(username, token);

    // Generate MFA code and store as "last generated code"
    const mfaCode = generateMfaCode(getUser(username).mfa.secret);
    setMfaCode(username, mfaCode);

    return NextResponse.json({ token });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
