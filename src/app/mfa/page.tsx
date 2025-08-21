"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { generateMfaCode, validateMfaCode } from "@/lib/mfa";

export default function MfaPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [currentCode, setCurrentCode] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  // To Auto-refresh the current valid code every 1s
  useEffect(() => {
    const update = () => setCurrentCode(generateMfaCode());
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (locked) return;

    if (validateMfaCode(code)) {
      router.push("/dashboard");
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      if (newAttempts >= 3) {
        setLocked(true);
        setError("Too many invalid attempts. You are locked out.");
      } else {
        setError(`Invalid MFA code. Attempt ${newAttempts} of 3.`);
      }
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 text-black">
      <h1 className="text-2xl font-semibold mb-4">MFA Verification</h1>
      <p className="mb-2">
        Enter the 6-digit code from your authenticator app.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full rounded border p-2"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="123456"
          maxLength={6}
          disabled={locked}
          required
        />
        <button
          type="submit"
          className={`${"w-full rounded px-4 py-2 text-white"} ${
            locked ? "bg-gray-400 cursor-default" : "bg-gray-900 cursor-pointer"
          }`}
          disabled={locked}
        >
          Verify
        </button>
      </form>

      {error && <p className="mt-2 text-red-600">{error}</p>}

      {/* Display the mfa code so user know what to input */}
      <p className="mt-4 text-sm text-gray-600">
        MFA code so that user know what to input:{" "}
        <span className="font-mono">{currentCode}</span>
      </p>
    </div>
  );
}
