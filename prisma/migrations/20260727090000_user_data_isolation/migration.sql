-- Existing task data is intentionally discarded before adding required owners.
DELETE FROM "todos";
DELETE FROM "category";

-- DropForeignKey
ALTER TABLE "todos" DROP CONSTRAINT "todos_category_id_fkey";

-- AlterTable
ALTER TABLE "category" ADD COLUMN     "user_id" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "todos" ADD COLUMN     "completed_at" TIMESTAMPTZ(6),
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL,
ADD COLUMN     "user_id" BIGINT NOT NULL;

-- CreateIndex
CREATE INDEX "category_user_id_idx" ON "category"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "category_user_id_category_name_key" ON "category"("user_id", "category_name");

-- CreateIndex
CREATE INDEX "todos_user_id_completed_idx" ON "todos"("user_id", "completed");

-- CreateIndex
CREATE INDEX "todos_category_id_idx" ON "todos"("category_id");

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "todos" ADD CONSTRAINT "todos_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
