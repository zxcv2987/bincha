-- CreateTable
CREATE TABLE "memo" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "content" TEXT NOT NULL,
    "link" TEXT NOT NULL DEFAULT '',
    "user_id" BIGINT NOT NULL,

    CONSTRAINT "memo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "memo_user_id_idx" ON "memo"("user_id");

-- AddForeignKey
ALTER TABLE "memo" ADD CONSTRAINT "memo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- This application accesses this table only through the server-side Prisma
-- connection. Block the Supabase Data API roles at both the grant and row
-- security layers while leaving the privileged Prisma connection unchanged.
REVOKE ALL PRIVILEGES ON TABLE "memo" FROM anon, authenticated;

ALTER TABLE "memo" ENABLE ROW LEVEL SECURITY;

-- Intentionally no permissive policies: anon/authenticated must not access
-- any rows through the Data API. The Prisma role has BYPASSRLS.
