import { RouteRecordRaw } from 'vue-router'
import { defineStore } from 'pinia'
import { constantRoutes, router } from '@/router'
import { useAppStore, useAuthStore, useTabStore } from '@/store'
import {
    localStg,
    getCacheRoutes,
    getConstantRouteNames,
    transformAuthRouteToMenu
} from '@/utils'

interface RouteState {
    /**
     * 权限路由模式：
     * - static - 前端声明的静态
     * - dynamic - 后端返回的动态
     */
    authRouteMode: ImportMetaEnv['VITE_AUTH_ROUTE_MODE']
    /** 是否初始化了权限路由 */
    isInitAuthRoute: boolean
    /** 路由首页name(前端静态路由时生效，后端动态路由改值会被后端返回的值覆盖) */
    routeHomeName: 'home'
    /** 菜单 */
    menus: App.GlobalMenuOption[]
    /** 搜索菜单 */
    // searchMenus: AuthRoute.Route[]
    /** 缓存的路由名称 */
    cacheRoutes: string[]
}

export const useRouteStore = defineStore('route-store', {
    state: (): RouteState => ({
        menus: [],
        cacheRoutes: [],
        routeHomeName: 'home',
        isInitAuthRoute: false,
        authRouteMode: import.meta.env.VITE_AUTH_ROUTE_MODE
    }),
    actions: {
        /** 重置路由的store */
        resetRouteStore() {
            // TODO 待解决路由重置的问题
            // this.resetRoutes()
            this.$reset()
        },
        /** 重置路由数据，保留固定路由 */
        resetRoutes() {
            const routes = router.getRoutes()
            routes.forEach((route) => {
                const name = route.name || 'root'
                if (!this.isConstantRoute(name as string)) {
                    router.removeRoute(name)
                }
            })
        },
        /** 是否是固定路由 */
        isConstantRoute(name: string) {
            const constantRouteNames = getConstantRouteNames(constantRoutes)
            return constantRouteNames.includes(name)
        },
        /**
         * 是否是有效的固定路由
         * @param name 路由名称
         */
        isValidConstantRoute(name: string) {
            const NOT_FOUND_PAGE_NAME = 'not-found'
            const constantRouteNames = getConstantRouteNames(constantRoutes)
            return (
                constantRouteNames.includes(name) &&
                name !== NOT_FOUND_PAGE_NAME
            )
        },
        /**
         * 处理权限路由
         * @param routes - 权限路由
         */
        handleAuthRoute(routes: AuthRoute.Route[]) {
            ;(this.menus as App.GlobalMenuOption[]) =
                transformAuthRouteToMenu(routes)
            // this.searchMenus = transformAuthRouteToSearchMenu(routes)

            // const vueRoutes = transformAuthRouteToVueRoute(routes)

            // vueRoutes.forEach((route) => {
            // router.addRoute(route)
            // })
            // this.cacheRoutes = getCacheRoutes(vueRoutes)
        },
        /** 动态路由模式下，更新根路由的重定向 */
        handleUpdateRootRedirect(routeKey: string) {
            if (routeKey === 'root' || routeKey === 'not-found') {
                throw new Error('routeKey 的值不能为 root 或者 not-found')
            }
            // const rootRoute: AuthRoute.Route = {
            // ...ROOT_ROUTE,
            // redirect: transformRouteNameToRoutePath(routeKey)
            // }
            const rootRouteName = 'root'
            router.removeRoute(rootRouteName)
            // const rootVueRoute = transformAuthRouteToVueRoute(rootRoute)[0]
            // router.addRoute(rootVueRoute)
        },
        /** 初始化动态路由 */
        async initDynamicRoute() {
            // const { resetAuthStore } = useAuthStore()
            // const { initHomeTab } = useTabStore()

            const { userId } = localStg.get('userInfo') || {}

            if (!userId) {
                throw new Error('userId 不能为空！')
            }

            // const { error, data} = await fetchUserRoutes(userId);

            // if (!error) {
            //   this.routeHomeName = data.home;
            //   this.handleUpdateRootRedirect(data.home);
            //   this.handleAuthRoute(sortRoutes(data.routes));

            //   initHomeTab(data.home, router);

            //   this.isInitAuthRoute = true;
            // } else {
            // resetAuthStore();
            // }
        },
        /** 初始化静态路由 */
        async initStaticRoute() {
            const { initHomeTab } = useTabStore()
            const auth = useAuthStore()
            // 通过userInfo 的用户角色权限过滤用户可访问的路由
            // const routes = filterAuthRoutesByUserPermission(staticRoutes, auth.userInfo.userRole);
            // this.handleAuthRoute(routes)

            initHomeTab(this.routeHomeName, router)

            this.isInitAuthRoute = true
        },
        /** 初始化权限路由 */
        async initAuthRoute() {
            if (this.authRouteMode === 'dynamic') {
                await this.initDynamicRoute()
            } else {
                await this.initStaticRoute()
            }
        },
        /** 从缓存路由中去除某个路由 */
        removeCacheRoute(name: string) {
            const index = this.cacheRoutes.indexOf(name)
            if (index > -1) {
                this.cacheRoutes.splice(index, 1)
            }
        },
        /** 添加某个缓存路由 */
        addCacheRoute(route: any) {
            if (route?.meta?.keepAlive) {
                const index = this.cacheRoutes.indexOf(route.name)
                if (index === -1) {
                    this.cacheRoutes.push(route.name)
                }
            }
        },
        /**
         * 重新缓存路由
         */
        async reCacheRoute(name: string) {
            const { reloadPage } = useAppStore()

            const isCached = this.cacheRoutes.includes(name)

            if (isCached) {
                this.removeCacheRoute(name)
            }

            await reloadPage()

            if (isCached) {
                this.addCacheRoute(name)
            }
        }
    }
})
