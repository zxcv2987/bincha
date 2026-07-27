-- This application accesses these tables only through the server-side Prisma
-- connection. Block the Supabase Data API roles at both the grant and row
-- security layers while leaving the privileged Prisma connection unchanged.
REVOKE ALL PRIVILEGES ON TABLE "category" FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE "todos" FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE "user" FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE "task_result" FROM anon, authenticated;

ALTER TABLE "category" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "todos" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "task_result" ENABLE ROW LEVEL SECURITY;

-- Intentionally no permissive policies: anon/authenticated must not access
-- any rows through the Data API. The Prisma role has BYPASSRLS.
