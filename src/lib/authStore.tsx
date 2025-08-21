import crypto from "crypto";

// Simple in-memory store
type SecureWordState = {
  value: string;
  timeStamp: number;
  lastRequestedAt: number;
};

type MfaState = {
  secret: string;
  lastCode?: string;
  lastCodeIssuedAt?: number;
  attempts: number;
  lockedUntil?: number;
};

export type UserState = {
  secureWord?: SecureWordState;
  mfa: MfaState;
  sessionToken?: string;
};

const store = new Map<string, UserState>();

export const SEED_SECRET =
  process.env.SECURE_WORD_SECRET || "dev-secure-word-secret";

export function getUser(username: string): UserState {
  const key = username.trim().toLowerCase();
  let u = store.get(key);
  if (!u) {
    u = { mfa: { secret: cryptoRandomHex(20), attempts: 0 } };
    store.set(key, u);
  }
  return u;
}

export function setSecureWord(
  username: string,
  value: string,
  timeStamp: number,
  lastRequestedAt: number
) {
  const u = getUser(username);
  u.secureWord = { value, timeStamp, lastRequestedAt };
}

export function setSessionToken(username: string, token: string) {
  const u = getUser(username);
  u.sessionToken = token;
}

export function setMfaCode(username: string, code: string) {
  const u = getUser(username);
  u.mfa.lastCode = code;
  u.mfa.lastCodeIssuedAt = Date.now();
  u.mfa.attempts = 0;
}

export function failMfaAttempt(username: string) {
  const u = getUser(username);
  u.mfa.attempts += 1;
  if (u.mfa.attempts >= 3) {
    u.mfa.lockedUntil = Date.now() + 2 * 60 * 1000; // 2 minutes lock
  }
  return u.mfa;
}

export function clearMfaLock(username: string) {
  const u = getUser(username);
  u.mfa.attempts = 0;
  u.mfa.lockedUntil = undefined;
}

export function cryptoRandomHex(bytes: number) {
  const buf = crypto.randomBytes(bytes);
  return buf.toString("hex");
}
