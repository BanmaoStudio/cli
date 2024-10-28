import { RouteRecordRaw } from 'vue-router'
import IconVersion from '~icons/carbon/version'

const VersionManageRoutes: RouteRecordRaw = {
    path: '/version_manage',
    name: 'VersionManagePage',
    meta: {
        title: '固件包版本管理',
        requiresAuth: true,
        keepAlive: false,
        permissions: ['admin', 'user'],
        icon: IconVersion,
        order: 8
    },
    component: () => import('@/views/version_manage/index.vue')
}

export default VersionManageRoutes
