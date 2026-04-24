export const INITIAL_TICKET_POLL_INTERVAL_MS = 2000;
export const MAX_TICKET_POLL_INTERVAL_MS = 8000;
export const TICKET_POLL_BACKOFF_EVERY = 4;
export const TICKET_POLL_MAX_ATTEMPTS = 30;

export function getTicketPollDelayMs(attempt, retryAfterHeader) {
  const retryAfterSeconds = Number.parseInt(retryAfterHeader, 10);

  if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
    return retryAfterSeconds * 1000;
  }

  const backoffStep = Math.floor(attempt / TICKET_POLL_BACKOFF_EVERY);
  return Math.min(
    INITIAL_TICKET_POLL_INTERVAL_MS * 2 ** backoffStep,
    MAX_TICKET_POLL_INTERVAL_MS,
  );
}
