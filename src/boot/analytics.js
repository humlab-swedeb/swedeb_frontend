import { boot } from "quasar/wrappers";
import VueGtag from "vue-gtag-next";

// Hämta samtycke från localStorage
const getCookieConsent = () =>
  localStorage.getItem("cookie_consent") === "true";

export default boot(({ app, router }) => {
  if (getCookieConsent() && window.location.hostname !== "localhost") {
    app.use(
      VueGtag,
      {
        property: { id: "G-N2ELM6TKKD" },
        enabled: true, // Endast aktiverat om samtycke ges
      },
      router
    );
  }
});
