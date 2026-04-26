export const TICKET_POLL_INTERVAL_MS = 2000;
export const TICKET_POLL_MAX_ATTEMPTS = 90;

export function getTicketPollDelayMs(attempt, retryAfterHeader) {
  const retryAfterSeconds = Number.parseInt(retryAfterHeader, 10);

  if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
    return retryAfterSeconds * 1000;
  }

  return TICKET_POLL_INTERVAL_MS;
}
