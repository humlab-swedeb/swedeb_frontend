import { boot } from "quasar/wrappers";

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  // Suppress benign ResizeObserver errors that occur during development
  // This is a common timing issue that doesn't affect functionality
  // See: https://github.com/quasarframework/quasar/issues/2233
  const resizeObserverLoopErrRe = /ResizeObserver loop/;

  window.addEventListener("error", (e) => {
    if (resizeObserverLoopErrRe.test(e.message)) {
      const resizeObserverErrDiv = document.getElementById(
        "webpack-dev-server-client-overlay-div",
      );
      const resizeObserverErr = document.getElementById(
        "webpack-dev-server-client-overlay",
      );
      if (resizeObserverErr) {
        resizeObserverErr.setAttribute("style", "display: none");
      }
      if (resizeObserverErrDiv) {
        resizeObserverErrDiv.setAttribute("style", "display: none");
      }
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  });
});
