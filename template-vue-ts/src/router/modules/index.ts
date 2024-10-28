const modules = import.meta.glob("./**/*.ts", { eager: true });

export const routes = handleModuleRoutes(modules);

function handleModuleRoutes(modules: any) {
  const routes: any[] = [];

  Object.keys(modules).forEach((key) => {
    const item = modules[key].default;
    if (Array.isArray(item)) {
      routes.push(...item);
    } else {
      if (item) {
        routes.push(item);
      } else {
        window.console.error(`路由模块解析出错: key = ${key}`);
      }
    }
  });

  return sortRoutes(routes);
}
function sortRoutes(routes: any[]) {
  return routes
    .sort((next, pre) => Number(next.meta?.order) - Number(pre.meta?.order))
    .map((i) => {
      if (i.children) sortRoutes(i.children);
      return i;
    });
}
