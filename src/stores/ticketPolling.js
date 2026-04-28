import i18n from "src/i18n/sv/index.js";

export const TICKET_POLL_INTERVAL_MS = 2000;
export const TICKET_POLL_MAX_ATTEMPTS = 300;

export function getTicketPollDelayMs(attempt, retryAfterHeader) {
  const retryAfterSeconds = Number.parseInt(retryAfterHeader, 10);

  if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
    return retryAfterSeconds * 1000;
  }

  return TICKET_POLL_INTERVAL_MS;
}

/**
 * Poll an archive-ticket status endpoint until the ticket is ready or fails.
 *
 * @param {import('axios').AxiosInstance} api - The axios instance to use.
 * @param {object} options
 * @param {string} options.statusUrl - URL of the archive status endpoint.
 * @param {number} [options.maxAttempts] - Maximum poll attempts before timeout.
 * @param {function} [options.onStatus] - Called with the status string on each poll.
 * @returns {Promise<object>} Resolves with the final status response data when ready.
 * @throws {Error} If the ticket enters an error state or the poll limit is reached.
 */
export async function pollArchiveTicket(
  api,
  { statusUrl, maxAttempts = TICKET_POLL_MAX_ATTEMPTS, onStatus } = {},
) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const response = await api.get(statusUrl);
    const { status, error } = response.data;

    if (onStatus) onStatus(status);

    if (status === "ready") return response.data;
    if (status === "error")
      throw new Error(error || i18n.downloadFeedback?.archiveGenerationFailed);

    const delayMs = getTicketPollDelayMs(
      attempt,
      response.headers?.["retry-after"],
    );
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  throw new Error(i18n.downloadFeedback?.archiveGenerationTimeout);
}
