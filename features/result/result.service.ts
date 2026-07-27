import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import { serializeBigInt } from "@/lib/serialize/serializeBigInt";
import {
  CompletedTodoRequiredError,
  ResultAlreadyExistsError,
  ResultNotFoundError,
} from "./result.errors";

type ResultInput = {
  summary: string;
  changeSummary: string;
  unexpected: string;
  nextAction: string;
  evidenceUrl: string;
  needsMeasurement: boolean;
};

export async function createTaskResult({
  todoId,
  userId,
  ...input
}: ResultInput & { todoId: number; userId: bigint }) {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const todo = await tx.todos.findFirst({
        where: { id: todoId, user_id: userId, completed: true },
      });
      if (!todo) throw new CompletedTodoRequiredError();

      const existing = await tx.task_result.findUnique({
        where: { todo_id: todo.id },
      });
      if (existing) throw new ResultAlreadyExistsError();

      return tx.task_result.create({
        data: {
          todo_id: todo.id,
          user_id: userId,
          summary: input.summary,
          change_summary: input.changeSummary,
          unexpected: input.unexpected,
          next_action: input.nextAction,
          evidence_url: input.evidenceUrl,
          needs_measurement: input.needsMeasurement,
        },
      });
    });
    return serializeBigInt(result);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new ResultAlreadyExistsError();
    }
    throw error;
  }
}

export async function updateTaskResult({
  resultId,
  userId,
  ...input
}: ResultInput & { resultId: number; userId: bigint }) {
  const existing = await prisma.task_result.findFirst({
    where: { id: resultId, user_id: userId },
  });
  if (!existing) throw new ResultNotFoundError();

  const result = await prisma.task_result.update({
    where: { id: existing.id },
    data: {
      summary: input.summary,
      change_summary: input.changeSummary,
      unexpected: input.unexpected,
      next_action: input.nextAction,
      evidence_url: input.evidenceUrl,
      needs_measurement: input.needsMeasurement,
    },
  });
  return serializeBigInt(result);
}

export async function deleteTaskResult(resultId: number, userId: bigint) {
  const deleted = await prisma.task_result.deleteMany({
    where: { id: resultId, user_id: userId },
  });
  if (deleted.count === 0) throw new ResultNotFoundError();
}

export async function getPendingTodos(userId: bigint) {
  const todos = await prisma.todos.findMany({
    where: { user_id: userId, completed: true, result: null },
    include: { category: true, result: true },
    orderBy: { completed_at: "desc" },
  });
  return serializeBigInt(todos);
}

export async function getResults(userId: bigint) {
  const results = await prisma.task_result.findMany({
    where: { user_id: userId },
    include: { todo: { include: { category: true, result: true } } },
    orderBy: { created_at: "desc" },
  });
  return serializeBigInt(results);
}
