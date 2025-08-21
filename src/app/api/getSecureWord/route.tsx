import { NextResponse } from "next/server";
import { createHmac } from "crypto";
import { getUser, setSecureWord, SEED_SECRET } from "@/lib/authStore";

export async function POST(req: Request) {
  try {
    const { username } = await req.json();
    if (!username || typeof username !== "string") {
      return NextResponse.json({ error: "username required" }, { status: 400 });
    }

    const u = getUser(username);
    const now = Date.now();

    // Rate limit once every 10 seconds per user
    if (
      u.secureWord?.lastRequestedAt &&
      now - u.secureWord.lastRequestedAt < 10_000
    ) {
      const retryIn = Math.ceil(
        (10_000 - (now - u.secureWord.lastRequestedAt)) / 1000
      );
      return NextResponse.json(
        { error: `Too many requests. Try again in ${retryIn}s.` },
        { status: 429 }
      );
    }

    // Generate secure word from username + current second (unique, time-tied)
    const raw = `${username}:${now}`;
    const hash = createHmac("sha256", SEED_SECRET).update(raw).digest("hex");
    const secureWord = hash.slice(0, 8).toUpperCase();

    const timeStamp = now + 60_000; // 60 seconds
    setSecureWord(username, secureWord, timeStamp, now);

    return NextResponse.json({ secureWord, timeStamp });
  } catch (e) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
