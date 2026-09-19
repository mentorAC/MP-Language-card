import { HttpErrorResponse } from '@angular/common/http';

/**
 * The message the API sent, or `fallback` when the failure never reached it
 * (offline, a 500, a parse error). Keeps every toast on one wording rule.
 */
export function apiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse) {
    const message = (error.error as { message?: string } | null)?.message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }

  return fallback;
}
