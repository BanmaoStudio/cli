import { RouteRecordRaw } from 'vue-router'

const RegisterDeviceRoutes: RouteRecordRaw = {
    path: '/register_device',
    name: 'RegisterDevicePage',
    component: () => import('@/views/register/index.vue'),
    meta: {
        title: '加油机注册',
        requiresAuth: false,
        hide: true
    }
}

export default RegisterDeviceRoutes
