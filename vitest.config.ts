import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";
import { defineConfig } from "vitest/config";

export default defineConfig(() => {
  const env = parseEnv(readFileSync(".env.test", "utf8"));
  const databaseUrl = requireTestSchema(env.DATABASE_URL, "DATABASE_URL");
  const directUrl = requireTestSchema(env.DIRECT_URL, "DIRECT_URL");
  process.env.DATABASE_URL = databaseUrl;
  process.env.DIRECT_URL = directUrl;

  return {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL(".", import.meta.url)),
      },
    },
    test: {
      environment: "node",
      include: ["tests/**/*.test.ts"],
    },
  };
});

function requireTestSchema(value: string | undefined, key: string) {
  if (!value) throw new Error(`.env.test에 ${key}이(가) 필요합니다.`);

  const url = new URL(value);
  if (url.searchParams.get("schema") !== "test") {
    throw new Error(`${key}은(는) 반드시 schema=test를 사용해야 합니다.`);
  }
  return value;
}
