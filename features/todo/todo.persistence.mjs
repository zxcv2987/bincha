export function getTodosForUser(client, userId) {
  return client.todos.findMany({
    where: { user_id: userId },
    include: { category: true, result: true },
    orderBy: [{ id: "asc" }, { category_id: "asc" }],
  });
}

export async function updateOwnedTodo(
  client,
  { id, userId, data },
  NotFoundError = DefaultNotFoundError,
) {
  const existing = await client.todos.findFirst({
    where: { id, user_id: userId },
  });
  if (!existing) throw new NotFoundError();
  return client.todos.update({ where: { id: existing.id }, data });
}

export async function deleteOwnedTodo(
  client,
  { id, userId },
  NotFoundError = DefaultNotFoundError,
) {
  const deleted = await client.todos.deleteMany({
    where: { id, user_id: userId },
  });
  if (deleted.count === 0) throw new NotFoundError();
}

export function toggleOwnedTodoCompleted(
  client,
  { todoId, userId },
  NotFoundError = DefaultNotFoundError,
) {
  return client.$transaction(async (tx) => {
    const todo = await tx.todos.findFirst({
      where: { id: todoId, user_id: userId },
    });
    if (!todo) throw new NotFoundError();

    const completed = !todo.completed;
    return tx.todos.update({
      where: { id: todo.id },
      data: { completed, completed_at: completed ? new Date() : null },
    });
  });
}
class DefaultNotFoundError extends Error {}
