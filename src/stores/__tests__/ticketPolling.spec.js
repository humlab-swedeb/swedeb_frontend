import { describe, expect, it } from "vitest";

import {
  getTicketPollDelayMs,
  INITIAL_TICKET_POLL_INTERVAL_MS,
  MAX_TICKET_POLL_INTERVAL_MS,
} from "../ticketPolling";

describe("getTicketPollDelayMs", () => {
  it("uses Retry-After when the header is a positive integer", () => {
    expect(getTicketPollDelayMs(0, "3")).toBe(3000);
    expect(getTicketPollDelayMs(10, "1")).toBe(1000);
  });

  it("falls back to exponential backoff when Retry-After is missing or invalid", () => {
    expect(getTicketPollDelayMs(0, undefined)).toBe(
      INITIAL_TICKET_POLL_INTERVAL_MS,
    );
    expect(getTicketPollDelayMs(0, "abc")).toBe(
      INITIAL_TICKET_POLL_INTERVAL_MS,
    );
    expect(getTicketPollDelayMs(0, "0")).toBe(INITIAL_TICKET_POLL_INTERVAL_MS);
    expect(getTicketPollDelayMs(0, "-1")).toBe(INITIAL_TICKET_POLL_INTERVAL_MS);
  });

  it("doubles every four attempts and caps at the configured maximum", () => {
    expect(getTicketPollDelayMs(0)).toBe(2000);
    expect(getTicketPollDelayMs(3)).toBe(2000);
    expect(getTicketPollDelayMs(4)).toBe(4000);
    expect(getTicketPollDelayMs(7)).toBe(4000);
    expect(getTicketPollDelayMs(8)).toBe(MAX_TICKET_POLL_INTERVAL_MS);
    expect(getTicketPollDelayMs(20)).toBe(MAX_TICKET_POLL_INTERVAL_MS);
  });
});
