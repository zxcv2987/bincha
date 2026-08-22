import { DomainError } from "@/features/shared/errors/DomainError";

export class ResultNotFoundError extends DomainError {
  constructor() {
    super("결과를 찾을 수 없습니다.");
  }
}

export class ResultAlreadyExistsError extends DomainError {
  constructor() {
    super("이미 결과가 기록된 할 일입니다.");
  }
}

export class CompletedTodoRequiredError extends DomainError {
  constructor() {
    super("완료한 작업에만 결과를 기록할 수 있습니다.");
  }
}
