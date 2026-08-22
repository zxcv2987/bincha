import { DomainError } from "@/features/shared/errors/DomainError";

export class TodoNotFoundError extends DomainError {
  constructor() {
    super("할 일을 찾을 수 없습니다.");
  }
}

export class TodoOrderConflictError extends DomainError {
  constructor() {
    super("할 일 목록이 변경됐어요. 새로고침 후 다시 시도해 주세요.");
  }
}
