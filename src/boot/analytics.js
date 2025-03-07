import { boot } from "quasar/wrappers";
import VueGtag from "vue-gtag-next";

export default boot(({ app, router }) => {
  if (window.location.hostname !== "localhost") {
  // Dynamiskt ladda in gtag.js
  const script = document.createElement("script");
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-N2ELM6TKKD";
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    console.log("gtag.js loaded");

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    window.gtag = gtag;

    gtag("js", new Date());
    gtag("config", "G-N2ELM6TKKD");
  };

  app.use(
    VueGtag,
    {
      config: { id: "G-N2ELM6TKKD" },
    },
    router
  );
  }
});
