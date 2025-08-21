export function generateMfaCode(secret: string): string {
  // Simulate: just take last 6 digits of a hash/number
  const hash = Math.abs(
    Array.from(secret).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  );

  // Always return a 6-digit string
  return (hash % 1_000_000).toString().padStart(6, "0");
}
