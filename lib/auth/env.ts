function encodeSecret(envName: string): Uint8Array {
  const secret = process.env[envName];
  if (!secret) {
    throw new Error(`${envName} is not set`);
  }
  return new TextEncoder().encode(secret);
}

export function getAccessSecret(): Uint8Array {
  return encodeSecret("JWT_SECRET");
}

export function getRefreshSecret(): Uint8Array {
  return encodeSecret("JWT_REFRESH_SECRET");
}
