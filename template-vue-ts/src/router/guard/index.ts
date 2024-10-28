import type { Router } from 'vue-router'
// import { useTitle } from '@vueuse/core'
import NProgress from 'nprogress'
import { createPermissionGuard } from './permission'
import { useRouteStore } from '@/store'

/**
 * 路由守卫函数
 * @param router - 路由实例
 */
export function createRouterGuard(router: Router) {
    router.beforeEach(async (to, from, next) => {
        const routeStore = useRouteStore()
        // 开始 loadingBar
        NProgress.start()

        // 页面跳转权限处理
        await createPermissionGuard(to, from, next)

        routeStore.addCacheRoute(to)
    })
    router.afterEach((to) => {
        // 设置document title
        // useTitle(to.meta.title + '——' + import.meta.env.VITE_APP_TITLE);
        // 结束 loadingBar
        NProgress.done()
    })
}
