export class CategoryNotFoundError extends Error {}

export class CategoryAlreadyExistsError extends Error {}

export class CategoryOrderConflictError extends Error {}

export class CategoryHasTodosError extends Error {
  constructor(public readonly todoCount: number) {
    super(`Category has ${todoCount} todo(s), cannot delete`);
  }
}
