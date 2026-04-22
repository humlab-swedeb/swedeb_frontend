import { useGtag } from "vue-gtag-next";

const getCookieConsent = () =>
  localStorage.getItem("cookie_consent") === "true";

/**
 * Returns a `gtagEvent` function that is either the real gtag event tracker
 * (when cookie consent has been granted and the hostname is not localhost) or
 * a no-op so callers never need to null-check before firing an event.
 */
export function useGtagEvent() {
  const isAnalyticsEnabled =
    getCookieConsent() && window.location.hostname !== "localhost";

  let gtagEvent = () => {};
  if (isAnalyticsEnabled) {
    try {
      const gtag = useGtag();
      if (gtag?.event) gtagEvent = gtag.event;
    } catch (e) {
      // Analytics not initialized properly
    }
  }

  return { gtagEvent };
}
