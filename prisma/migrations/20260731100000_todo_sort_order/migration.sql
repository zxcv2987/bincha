-- Add the nullable column first so existing todos can receive stable positions.
ALTER TABLE "todos" ADD COLUMN "sort_order" INTEGER;

WITH ranked_todos AS (
  SELECT
    "id",
    ROW_NUMBER() OVER (PARTITION BY "category_id" ORDER BY "id") - 1 AS "position"
  FROM "todos"
)
UPDATE "todos"
SET "sort_order" = ranked_todos."position"
FROM ranked_todos
WHERE "todos"."id" = ranked_todos."id";

ALTER TABLE "todos" ALTER COLUMN "sort_order" SET DEFAULT 0;
ALTER TABLE "todos" ALTER COLUMN "sort_order" SET NOT NULL;

DROP INDEX "todos_category_id_idx";
CREATE INDEX "todos_category_id_sort_order_idx" ON "todos"("category_id", "sort_order");
