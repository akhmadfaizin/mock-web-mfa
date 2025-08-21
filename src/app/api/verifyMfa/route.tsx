import { NextResponse } from "next/server";
import { getUser, failMfaAttempt, clearMfaLock } from "@/lib/authStore";

export async function POST(req: Request) {
  try {
    const { username, code } = await req.json();
    if (!username || !code) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const u = getUser(username);
    const now = Date.now();

    // Lockout check
    if (u.mfa.lockedUntil && now < u.mfa.lockedUntil) {
      const waitMs = u.mfa.lockedUntil - now;
      return NextResponse.json(
        { error: `Locked. Try again in ${Math.ceil(waitMs / 1000)}s` },
        { status: 423 }
      );
    }

    // Verify against the last generated code for that user
    const validCode = u.mfa.lastCode;
    const issuedAt = u.mfa.lastCodeIssuedAt ?? 0;

    // Expire MFA code after 60s to emulate TOTP window
    const expired = now - issuedAt > 60_000;

    if (!validCode || expired) {
      return NextResponse.json(
        { error: "MFA code expired. Restart login." },
        { status: 400 }
      );
    }

    if (code !== validCode) {
      const mfa = failMfaAttempt(username);
      if (mfa.lockedUntil && now < mfa.lockedUntil) {
        return NextResponse.json(
          { error: "Too many attempts. Locked for 2 minutes." },
          { status: 423 }
        );
      }
      const remaining = 3 - mfa.attempts;
      return NextResponse.json(
        { error: `Invalid code. ${remaining} attempt(s) left.` },
        { status: 401 }
      );
    }

    // Success
    clearMfaLock(username);
    return NextResponse.json({ success: true, next: "/dashboard" });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
