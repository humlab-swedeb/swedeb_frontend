import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";

import {
  getTicketPollDelayMs,
  pollArchiveTicket,
  TICKET_POLL_INTERVAL_MS,
  TICKET_POLL_MAX_ATTEMPTS,
} from "../ticketPolling";
import i18n from "src/i18n/sv/index.js";

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

describe("pollArchiveTicket", () => {
  let api;

  beforeEach(() => {
    vi.useFakeTimers();
    api = { get: vi.fn() };
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("success path", () => {
    it("resolves immediately when the first poll returns ready", async () => {
      const data = { status: "ready", download_url: "/files/archive.zip" };
      api.get.mockResolvedValue({ data, headers: {} });

      const result = await pollArchiveTicket(api, {
        statusUrl: "/v1/tools/archive/abc/status",
        maxAttempts: 3,
      });

      expect(api.get).toHaveBeenCalledOnce();
      expect(api.get).toHaveBeenCalledWith("/v1/tools/archive/abc/status");
      expect(result).toEqual(data);
    });

    it("resolves after a pending response followed by ready", async () => {
      api.get
        .mockResolvedValueOnce({ data: { status: "pending" }, headers: {} })
        .mockResolvedValueOnce({
          data: { status: "ready", download_url: "/files/archive.zip" },
          headers: {},
        });

      const promise = pollArchiveTicket(api, {
        statusUrl: "/v1/tools/archive/abc/status",
        maxAttempts: 5,
      });
      await vi.runAllTimersAsync();
      const result = await promise;

      expect(api.get).toHaveBeenCalledTimes(2);
      expect(result.status).toBe("ready");
    });
  });

  describe("error path", () => {
    it("throws with the server error message when status is error", async () => {
      api.get.mockResolvedValue({
        data: { status: "error", error: "Disk full" },
        headers: {},
      });

      await expect(
        pollArchiveTicket(api, { statusUrl: "/v1/tools/archive/abc/status" }),
      ).rejects.toThrow("Disk full");
    });

    it("falls back to the i18n message when error status has no message", async () => {
      api.get.mockResolvedValue({ data: { status: "error" }, headers: {} });

      await expect(
        pollArchiveTicket(api, { statusUrl: "/v1/tools/archive/abc/status" }),
      ).rejects.toThrow(i18n.downloadFeedback.archiveGenerationFailed);
    });
  });

  describe("max-attempts timeout", () => {
    it("throws the i18n timeout message after exhausting max attempts", async () => {
      api.get.mockResolvedValue({ data: { status: "pending" }, headers: {} });

      const promise = pollArchiveTicket(api, {
        statusUrl: "/v1/tools/archive/abc/status",
        maxAttempts: 2,
      });
      // Attach the rejection handler before advancing timers so the rejection
      // is handled the moment it occurs and does not become an unhandled rejection.
      const assertion = expect(promise).rejects.toThrow(
        i18n.downloadFeedback.archiveGenerationTimeout,
      );
      await vi.runAllTimersAsync();
      await assertion;
      expect(api.get).toHaveBeenCalledTimes(2);
    });
  });

  describe("onStatus callback", () => {
    it("calls onStatus with each polled status string in order", async () => {
      const onStatus = vi.fn();
      api.get
        .mockResolvedValueOnce({ data: { status: "pending" }, headers: {} })
        .mockResolvedValueOnce({ data: { status: "ready" }, headers: {} });

      const promise = pollArchiveTicket(api, {
        statusUrl: "/v1/tools/archive/abc/status",
        maxAttempts: 5,
        onStatus,
      });
      await vi.runAllTimersAsync();
      await promise;

      expect(onStatus).toHaveBeenCalledTimes(2);
      expect(onStatus).toHaveBeenNthCalledWith(1, "pending");
      expect(onStatus).toHaveBeenNthCalledWith(2, "ready");
    });
  });

  describe("Retry-After backoff", () => {
    it("waits the Retry-After header duration before the next poll", async () => {
      api.get
        .mockResolvedValueOnce({
          data: { status: "pending" },
          headers: { "retry-after": "5" },
        })
        .mockResolvedValueOnce({ data: { status: "ready" }, headers: {} });

      const promise = pollArchiveTicket(api, {
        statusUrl: "/v1/tools/archive/abc/status",
        maxAttempts: 3,
      });

      // First api.get is initiated synchronously when the async function starts.
      expect(api.get).toHaveBeenCalledTimes(1);

      // Drain the first awaited resolution so the 5 s setTimeout is scheduled.
      await vi.advanceTimersByTimeAsync(0);

      // 4 999 ms elapsed — the 5 s Retry-After timer has not yet fired.
      await vi.advanceTimersByTimeAsync(4999);
      expect(api.get).toHaveBeenCalledTimes(1);

      // 5 000 ms total — timer fires, second poll executes.
      await vi.advanceTimersByTimeAsync(1);
      const result = await promise;

      expect(api.get).toHaveBeenCalledTimes(2);
      expect(result.status).toBe("ready");
    });

    it("waits the default interval when Retry-After header is absent", async () => {
      api.get
        .mockResolvedValueOnce({ data: { status: "pending" }, headers: {} })
        .mockResolvedValueOnce({ data: { status: "ready" }, headers: {} });

      const promise = pollArchiveTicket(api, {
        statusUrl: "/v1/tools/archive/abc/status",
        maxAttempts: 3,
      });

      expect(api.get).toHaveBeenCalledTimes(1);

      await vi.advanceTimersByTimeAsync(0);

      // One millisecond short of the default interval — still waiting.
      await vi.advanceTimersByTimeAsync(TICKET_POLL_INTERVAL_MS - 1);
      expect(api.get).toHaveBeenCalledTimes(1);

      // Default interval elapsed — second poll executes.
      await vi.advanceTimersByTimeAsync(1);
      const result = await promise;

      expect(api.get).toHaveBeenCalledTimes(2);
      expect(result.status).toBe("ready");
    });
  });
});
