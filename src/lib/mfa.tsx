export function generateMfaCode(secret: string = "MY_MFA_SECRET"): string {
  const timeStep = 30; // new code every 30s
  const counter = Math.floor(Date.now() / 1000 / timeStep);

  // Simple hash-like operation for mock
  let hash = 0;
  const input = secret + counter.toString();
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) % 1_000_000;
  }

  return hash.toString().padStart(6, "0"); // always 6 digits
}

export function validateMfaCode(input: string, secret?: string): boolean {
  return input === generateMfaCode(secret);
}
