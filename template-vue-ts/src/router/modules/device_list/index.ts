import { RouteRecordRaw } from 'vue-router'
import IconDevice from '~icons/mingcute/device-line'

const DeviceListRoutes: RouteRecordRaw = {
    path: '/device_list',
    name: 'DeviceList',
    meta: {
        title: '设备列表',
        requiresAuth: true,
        keepAlive: false,
        permissions: ['admin', 'user'],
        icon: IconDevice,
        order: 4
    },
    component: () => import('@/views/device_list/index.vue')
}

export default DeviceListRoutes
