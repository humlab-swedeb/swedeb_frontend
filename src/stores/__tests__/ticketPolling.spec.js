import { describe, expect, it } from "vitest";

import {
  getTicketPollDelayMs,
  TICKET_POLL_INTERVAL_MS,
  TICKET_POLL_MAX_ATTEMPTS,
} from "../ticketPolling";

describe("getTicketPollDelayMs", () => {
  it("uses Retry-After when the header is a positive integer", () => {
    expect(getTicketPollDelayMs(0, "3")).toBe(3000);
    expect(getTicketPollDelayMs(10, "1")).toBe(1000);
  });

  it("falls back to a fixed interval when Retry-After is missing or invalid", () => {
    expect(getTicketPollDelayMs(0, undefined)).toBe(TICKET_POLL_INTERVAL_MS);
    expect(getTicketPollDelayMs(0, "abc")).toBe(TICKET_POLL_INTERVAL_MS);
    expect(getTicketPollDelayMs(0, "0")).toBe(TICKET_POLL_INTERVAL_MS);
    expect(getTicketPollDelayMs(0, "-1")).toBe(TICKET_POLL_INTERVAL_MS);
  });

  it("keeps the fallback interval fixed across attempts", () => {
    expect(getTicketPollDelayMs(0)).toBe(TICKET_POLL_INTERVAL_MS);
    expect(getTicketPollDelayMs(4)).toBe(TICKET_POLL_INTERVAL_MS);
    expect(getTicketPollDelayMs(20)).toBe(TICKET_POLL_INTERVAL_MS);
  });

  it("allows 180 seconds of polling when Retry-After is 2 seconds", () => {
    expect(TICKET_POLL_MAX_ATTEMPTS * 2).toBe(180);
  });
});
