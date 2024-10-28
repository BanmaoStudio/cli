import type { RouteRecordRaw } from 'vue-router'
import AntDesignHomeOutlined from '~icons/ant-design/home-outlined'

const HomeRoutes: RouteRecordRaw = {
    path: '/home',
    name: 'HomePage',
    component: () => import('@/views/home/index.vue'),
    meta: {
        title: '首页',
        icon: AntDesignHomeOutlined,
        // affix: true,
        requiresAuth: true,
        permissions: ['admin', 'user'],
        keepAlive: false,
        order: 1
    }
}

export default HomeRoutes
