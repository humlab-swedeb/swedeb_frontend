const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [

      { path: "pdf", component: () => import("pages/PdfPage.vue") },

      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        meta: { title: "Hem" },
      },
      {
        path: "about",
        component: () => import("pages/AboutPage.vue"),
        meta: { title: "Om" },
      },
      {
        path: "faq",
        component: () => import("pages/FAQPage.vue"),
        meta: { title: "FAQ" },
      },

    ],
  },
  {
    path: "/tools",
    component: () => import("layouts/ToolsLayout.vue"),
    children: [
      {
        path: "wordtrends",
        component: () => import("pages/WordTrendsPage.vue"),
        meta: { title: "Ordtrender" },
      },
      {
        path: "kwic",
        component: () => import("pages/KWICPage.vue"),
        meta: { title: "KWIC" },
      },
      {
        path: "speeches",
        component: () => import("pages/SpeechesPage.vue"),
        meta: { title: "Anföranden" },
      },
      {
        path: "ngram",
        component: () => import("pages/NgramPage.vue"),
        meta: { title: "N-Gram" },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/ErrorNotFound.vue"),
        meta: { title: "Sidan hittades inte" },
      },
    ],
  },
];

export default routes;
