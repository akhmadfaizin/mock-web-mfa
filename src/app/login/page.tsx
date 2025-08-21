"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SecureWordResp = { secureWord: string; timeStamp: number };

export default function LoginPage() {
  const router = useRouter();

  const [step, setStep] = useState<"username" | "secureWord" | "password">(
    "username"
  );
  const [username, setUsername] = useState("");
  const [secureWord, setSecureWord] = useState<string>("");
  const [timeStamp, setTimeStamp] = useState<number>(0);
  const [countdown, setCountdown] = useState<number>(0);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");

  const expired = countdown <= 0;

  // countdown timer
  useEffect(() => {
    if (!timeStamp) return;
    const id = setInterval(() => {
      const left = Math.max(0, Math.ceil((timeStamp - Date.now()) / 1000));
      setCountdown(left);
    }, 500);
    return () => clearInterval(id);
  }, [timeStamp]);

  async function requestSecureWord() {
    setError("");
    try {
      const res = await fetch("/api/getSecureWord", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to get secure word");
        return;
      }
      const { secureWord, timeStamp } = data as SecureWordResp;
      setSecureWord(secureWord);
      setTimeStamp(timeStamp);
      setStep("secureWord");
    } catch (e) {
      setError("Network error");
    }
  }

  async function onPasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      // Hash password using Web Crypto (SHA-256)
      const enc = new TextEncoder();
      const digest = await crypto.subtle.digest(
        "SHA-256",
        enc.encode(password)
      );
      const hashHex = Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      console.log("submit expired", expired);

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          hashedPassword: hashHex,
          secureWord,
          expired,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Save token client-side for demo
      if (data.token) {
        localStorage.setItem("demo_token", data.token);
        localStorage.setItem("demo_user", username);
      }
      router.push("/mfa");
    } catch {
      setError("Network error");
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 text-black">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>

      {error && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {step === "username" && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            requestSecureWord();
          }}
          className="space-y-4"
        >
          <label className="block">
            <span className="text-sm text-gray-700">Username</span>
            <input
              className="mt-1 w-full rounded border p-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter Username"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded bg-gray-900 px-4 py-2 text-white cursor-pointer"
            disabled={!username.trim()}
          >
            Get Secure Word
          </button>
        </form>
      )}

      {step === "secureWord" && (
        <div className="space-y-4">
          <div className="rounded border p-4">
            <div className="text-sm text-gray-600">Your secure word:</div>
            <div className="mt-1 text-3xl font-mono tracking-wide">
              {secureWord}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Expires in{" "}
              <span
                className={`font-semibold ${
                  countdown <= 10 ? "text-red-600" : ""
                }`}
              >
                {countdown}s
              </span>
              . Please proceed quickly.
            </div>
          </div>

          <div className="flex gap-2">
            <button
              className="flex-1 rounded bg-gray-900 px-4 py-2 text-white disabled:opacity-50 cursor-pointer"
              onClick={() => setStep("password")}
              disabled={expired}
            >
              Next
            </button>
            <button
              className="rounded border px-4 py-2 cursor-pointer"
              onClick={requestSecureWord}
            >
              Request New
            </button>
          </div>
        </div>
      )}

      {step === "password" && (
        <form onSubmit={onPasswordSubmit} className="space-y-4">
          <div className="rounded border p-3 bg-gray-50">
            <div className="text-sm text-gray-700">
              Secure word used: <span className="font-mono">{secureWord}</span>
            </div>
          </div>
          <label className="block">
            <span className="text-sm text-gray-700">Password</span>
            <input
              type="password"
              className="mt-1 w-full rounded border p-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded bg-gray-900 px-4 py-2 text-white cursor-pointer"
          >
            Login
          </button>
        </form>
      )}
    </div>
  );
}
