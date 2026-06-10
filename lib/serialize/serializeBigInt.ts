// Prisma BigInt fields are serialized at runtime; input/output shapes differ at compile time.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeBigInt(obj: any) {
  return JSON.parse(
    JSON.stringify(obj, (_, value) =>
      typeof value === "bigint" ? Number(value) : value,
    ),
  );
}
