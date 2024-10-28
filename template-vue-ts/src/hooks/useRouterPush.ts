import { useRouter } from 'vue-router'
import type { RouteLocationRaw } from 'vue-router'
import { router as globalRouter, routeName } from '@/router'

export function useRouterPush(isSetup = true) {
    const router = isSetup ? useRouter() : globalRouter
    const route = globalRouter.currentRoute

    function routerPush(to: RouteLocationRaw, newTab = false) {
        if (newTab) {
            const routerData = router.resolve(to)
            window.open(routerData.href, '_blank')
            return Promise.resolve()
        }
        return router.push(to)
    }

    function routerBack() {
        router.go(-1)
    }

    function toHome(newTab = false) {
        routerPush({ name: routeName('root') }, newTab)
    }

    function toLogin(redirectUrl?: string) {
        const routeLocation: RouteLocationRaw = {
            name: routeName('login')
        }
        const redirect = redirectUrl || route.value.fullPath
        Object.assign(routeLocation, { query: { redirect } })
        routerPush(routeLocation)
    }

    function toLoginRedirect() {
        const { query } = route.value
        if (query?.redirect) {
            routerPush(query.redirect as string)
        } else {
            toHome()
        }
    }

    return {
        routerPush,
        routerBack,
        toHome,
        toLogin,
        toLoginRedirect
    }
}
