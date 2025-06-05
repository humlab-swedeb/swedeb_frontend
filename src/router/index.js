import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistoryFunction = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const routerBase = process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE;
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistoryFunction(routerBase),
  });

  Router.beforeEach((to, from, next) => {
    document.title = to.meta.title
      ? `Riksdagsdebatter.se - ${to.meta.title}`
      : "Riksdagsdebatter.se - Riksdagens anföranden";
    next();
  });

  return Router;
});
