-- Add the nullable column first so existing categories can receive stable positions.
ALTER TABLE "category" ADD COLUMN "sort_order" INTEGER;

WITH ranked_categories AS (
  SELECT
    "id",
    ROW_NUMBER() OVER (PARTITION BY "user_id" ORDER BY "id") - 1 AS "position"
  FROM "category"
)
UPDATE "category"
SET "sort_order" = ranked_categories."position"
FROM ranked_categories
WHERE "category"."id" = ranked_categories."id";

ALTER TABLE "category" ALTER COLUMN "sort_order" SET DEFAULT 0;
ALTER TABLE "category" ALTER COLUMN "sort_order" SET NOT NULL;

DROP INDEX "category_user_id_idx";
CREATE INDEX "category_user_id_sort_order_idx" ON "category"("user_id", "sort_order");
