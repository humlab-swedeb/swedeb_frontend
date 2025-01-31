import { boot } from "quasar/wrappers";
import VueGtag from "vue-gtag";

export default boot(({ app, router }) => {
  // Set VueGtag instance on app, add router for auto-tracking
  app.use(
    VueGtag,
    {
      config: { id: "G-N2ELM6TKKD" }, //GTM-5GSMWDQ : G-03SMJW8F4W
    },
    router
  );
});
