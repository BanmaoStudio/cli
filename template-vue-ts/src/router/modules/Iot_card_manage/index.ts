import { RouteRecordRaw } from 'vue-router'
import IconDevice from '~icons/icon-park-outline/sim'

const IotCardRoutes: RouteRecordRaw = {
    path: '/Iot_card_manage',
    name: 'IoTCardManage',
    meta: {
        title: '物联网卡管理',
        requiresAuth: true,
        keepAlive: true,
        permissions: ['admin', 'user'],
        icon: IconDevice,
        order: 7
    },
    component: () => import('@/views/Iot_card_manage/index.vue')
}

export default IotCardRoutes
