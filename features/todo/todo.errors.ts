import { DomainError } from "@/features/shared/errors/DomainError";

export class TodoNotFoundError extends DomainError {
  constructor() {
    super("할 일을 찾을 수 없습니다.");
  }
}
