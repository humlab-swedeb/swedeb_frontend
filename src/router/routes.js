const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      { path: "about", component: () => import("pages/AboutPage.vue") },
      { path: "faq", component: () => import("pages/FAQPage.vue") },
    ],
  },
  {
    path: "/tools",
    component: () => import("layouts/ToolsLayout.vue"),
    children: [
      {
        path: "wordtrends",
        component: () => import("pages/WordTrendsPage.vue"),
      },
      { path: "kwic", component: () => import("pages/KWICPage.vue") },
      { path: "speeches", component: () => import("pages/SpeechesPage.vue") },
      { path: "ngram", component: () => import("pages/NgramPage.vue") },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
