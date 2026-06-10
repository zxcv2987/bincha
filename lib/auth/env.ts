function readEnv(envName: string): string {
  const value = process.env[envName];
  if (!value) {
    throw new Error(`${envName} is not set`);
  }
  return value;
}

function encodeSecret(envName: string): Uint8Array {
  return new TextEncoder().encode(readEnv(envName));
}

export function getAdminPassword(): string {
  return readEnv("ADMIN_PASSWORD");
}

export function getAccessSecret(): Uint8Array {
  return encodeSecret("JWT_SECRET");
}

export function getRefreshSecret(): Uint8Array {
  return encodeSecret("JWT_REFRESH_SECRET");
}
