import { createRouter, createWebHistory } from 'vue-router'
import type { App } from 'vue'
import { constantRoutes } from './routes'
import { routes } from './modules'

import { createRouterGuard } from './guard'

const asyncRoutes = {
    path: '/',
    name: 'root',
    component: () => import('@/layouts/BasicLayout.vue'),
    redirect: import.meta.env.VITE_ROUTE_HOME_PATH,
    meta: {
        title: '首页'
    },
    children: [...routes]
}

/** 创建路由实例 */
export const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_URL),
    routes: [...constantRoutes, asyncRoutes],
    scrollBehavior: () => ({ left: 0, top: 0 })
})

/** setup vue router. */
export async function setupRouter(app: App) {
    app.use(router)
    createRouterGuard(router)
    await router.isReady()
}

export const routeName = (key: string) => key

export { routes }

export default router

export * from './routes'
export * from './modules'
