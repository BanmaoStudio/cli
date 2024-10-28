import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";

/** 处理路由页面的权限 */
export async function createPermissionGuard(
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  if (to.meta.href) {
    window.open(to.meta.href);
    next({ path: from.fullPath, replace: true, query: from.query });
    return;
  }

  const token = localStorage.getItem("token");
  const isLogin = Boolean(token);

  if (to.path === "/login" || to.meta.requiresAuth === false) {
    next(); // 如果是登录页面，直接放行
  } else if (!isLogin) {
    next("/login"); // 如果没有用户信息，跳转到登录页面
  } else {
    next();
  }
}
