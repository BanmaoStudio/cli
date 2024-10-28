import type { RouteRecordRaw } from 'vue-router'
import { EnumPath } from '@/enums'
import { BlankLayout } from '@/layouts'

export const constantRoutes: RouteRecordRaw[] = [
    // {
    //   path: '/',
    //   name: 'home',
    //   redirect: EnumPath.HOME
    // },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: {
            title: '登录',
            requiresAuth: false
        }
    },
    {
        path: '/403',
        name: '403',
        component: () => import('@/views/_builtin/403/index.vue')
    },
    {
        path: '/404',
        name: '404',
        component: () => import('@/views/_builtin/404/index.vue')
    },
    {
        path: '/500',
        name: '500',
        component: () => import('@/views/_builtin/500/index.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: BlankLayout,
        children: [
            {
                path: '/:pathMatch(.*)*',
                name: 'not-found-page',
                component: () => import('@/views/_builtin/not-found/index.vue')
            }
        ]
    }
]
