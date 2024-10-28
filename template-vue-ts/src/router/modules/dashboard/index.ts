import type { RouteRecordRaw } from 'vue-router'

const DashboardRoutes: RouteRecordRaw = {
    path: '/dashboard',
    name: 'DashboardPage',
    meta: {
        title: '仪表盘',
        icon: 'Dashboard',
        affix: true,
        requiresAuth: true,
        permissions: ['admin', 'user'],
        keepAlive: false,
        order: 1
    },
    children: [
        {
            path: 'analysis',
            name: 'AnalysisPage',
            component: () => import('@/views/dashboard/analysis/index.vue'),
            meta: {
                title: '分析页',
                requiresAuth: true,
                permissions: ['admin', 'user'],
                keepAlive: false,
                order: 1
            }
        }
    ]
}

export default DashboardRoutes
