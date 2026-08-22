import { DomainError } from "@/features/shared/errors/DomainError";

export type AuthErrorCode =
  | "INVALID_CREDENTIALS"
  | "INVALID_TOKEN"
  | "MISSING_TOKEN"
  | "INVALID_PASSWORD"
  | "UNAUTHORIZED";

export class AuthError extends DomainError {
  constructor(
    public code: AuthErrorCode,
    message: string,
  ) {
    super(message);
  }
}

export function getStatusForAuthError(code: AuthErrorCode): number {
  switch (code) {
    case "INVALID_CREDENTIALS":
    case "INVALID_TOKEN":
    case "MISSING_TOKEN":
    case "UNAUTHORIZED":
      return 401;
    case "INVALID_PASSWORD":
      return 400;
    default:
      return 500;
  }
}
