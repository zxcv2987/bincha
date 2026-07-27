-- CreateTable
CREATE TABLE "task_result" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,
    "todo_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "summary" TEXT NOT NULL,
    "change_summary" TEXT NOT NULL DEFAULT '',
    "unexpected" TEXT NOT NULL DEFAULT '',
    "next_action" TEXT NOT NULL DEFAULT '',
    "evidence_url" TEXT NOT NULL DEFAULT '',
    "needs_measurement" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "task_result_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "task_result_todo_id_key" ON "task_result"("todo_id");

-- CreateIndex
CREATE INDEX "task_result_user_id_idx" ON "task_result"("user_id");

-- CreateIndex
CREATE INDEX "task_result_needs_measurement_idx" ON "task_result"("needs_measurement");

-- AddForeignKey
ALTER TABLE "task_result" ADD CONSTRAINT "task_result_todo_id_fkey" FOREIGN KEY ("todo_id") REFERENCES "todos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task_result" ADD CONSTRAINT "task_result_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
