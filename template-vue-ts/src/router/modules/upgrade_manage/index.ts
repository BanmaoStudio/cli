import { RouteRecordRaw } from 'vue-router'
import IconVersion from '~icons/carbon/upgrade'

const UpgradeManageRoutes: RouteRecordRaw = {
    path: '/upgrade_manage',
    name: 'UpgradeManagePage',
    meta: {
        title: '维护升级',
        requiresAuth: false,
        keepAlive: false,
        permissions: ['admin', 'user'],
        icon: IconVersion,
        order: 9
    },
    component: () => import('@/views/upgrade_manage/index.vue')
}

export default UpgradeManageRoutes
