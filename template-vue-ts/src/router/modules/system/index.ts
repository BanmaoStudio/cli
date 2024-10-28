import { RouteRecordRaw } from 'vue-router'
import { BlankLayout } from '@/layouts'
import AntDesignSettingOutlined from '~icons/ant-design/setting-outlined'

const SystemRoutes: RouteRecordRaw = {
    path: '/system',
    component: BlankLayout,
    name: 'system-group',
    meta: {
        title: '系统管理',
        roles: ['admin', 'user'],
        order: 99,
        icon: AntDesignSettingOutlined
    },
    redirect: '/system/account',
    children: [
        {
            path: '/system/account',
            name: 'SystemAccountPage',
            meta: {
                title: '账号管理',
                roles: ['admin', 'user'],
                order: 51
            },
            component: () => import('@/views/system/account/index.vue')
        },
        {
            path: '/system/roles',
            name: 'SystemRolePage',
            meta: {
                title: '角色管理',
                roles: ['admin'],
                order: 52
            },
            component: () => import('@/views/system/role/index.vue')
        },
        {
            path: '/system/menus',
            name: 'SystemMenuPage',
            meta: {
                title: '菜单管理',
                roles: ['admin'],
                order: 53
            },
            component: () => import('@/views/system/menu/index.vue')
        }
    ]
}

export default SystemRoutes
