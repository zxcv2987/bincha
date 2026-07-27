export function createCheckedTaskResult(
  client,
  { todoId, userId, data },
  {
    CompletedRequiredError = DefaultCompletedRequiredError,
    AlreadyExistsError = DefaultAlreadyExistsError,
  } = {},
) {
  return client.$transaction(async (tx) => {
    const todo = await tx.todos.findFirst({
      where: { id: todoId, user_id: userId, completed: true },
    });
    if (!todo) throw new CompletedRequiredError();

    const existing = await tx.task_result.findUnique({
      where: { todo_id: todo.id },
    });
    if (existing) throw new AlreadyExistsError();

    return tx.task_result.create({
      data: { todo_id: todo.id, user_id: userId, ...data },
    });
  });
}
class DefaultCompletedRequiredError extends Error {}
class DefaultAlreadyExistsError extends Error {}
