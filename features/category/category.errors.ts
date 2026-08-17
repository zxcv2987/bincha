import { DomainError } from "@/features/shared/errors/DomainError";

export class CategoryNotFoundError extends DomainError {
  constructor() {
    super("카테고리를 찾을 수 없습니다.");
  }
}

export class CategoryAlreadyExistsError extends DomainError {
  constructor() {
    super("이미 사용 중인 카테고리 이름입니다.");
  }
}

export class CategoryOrderConflictError extends DomainError {
  constructor() {
    super("카테고리 목록이 변경됐어요. 새로고침 후 다시 시도해 주세요.");
  }
}

export class CategoryHasTodosError extends DomainError {
  constructor(public readonly todoCount: number) {
    super(
      `이 카테고리에 할 일이 ${todoCount}개 있어 삭제할 수 없어요. 먼저 할 일을 다른 카테고리로 옮기거나 삭제해 주세요.`,
    );
  }
}
