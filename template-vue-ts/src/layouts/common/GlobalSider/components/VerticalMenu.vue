<template>
    <n-menu
        :value="activeKey"
        :collapse-width="64"
        :collapsed-icon-size="22"
        :options="menuList"
        :width="240"
        :native-scrollbar="false"
        :default-expanded-keys="expandedKeys"
        :expanded-keys="expandedKeys"
        :indent="18"
        accordion
        @update:value="handleUpdateMenu"
        @update:expanded-keys="handleUpdateExpandedKeys"
    />
</template>

<script setup lang="tsx">
import { RouterLink, useRouter, useRoute, RouteRecordRaw } from 'vue-router'
import { MenuDividerOption, MenuGroupOption, MenuOption, NIcon } from 'naive-ui'
import { useSorted } from '@vueuse/core'
import { useCommonStore } from '@/store'
import { useMenu } from '@/hooks'
import { routes } from '@/router'

defineOptions({ name: 'VerticalMenu' })

function renderIcon(icon: Component) {
    // return () => h(NIcon, null, { default: () => h(icon) })
    return () => (
        <NIcon>
            <icon />
        </NIcon>
    )
}

function renderLabel(route: any) {
    return () => <RouterLink to={route.path}>{route?.meta?.title}</RouterLink>
}

const route = useRoute()
const router = useRouter()
// const { routerPush } = useRouterPush()

const activeKey = ref('home')
const expandedKeys = ref<string[]>([])

// watch(
//   route,
//   (r, or) => {
//     // console.log('r', r)
//     const azRoute = r.fullPath.split("?")[0].split("/").slice(1);
//     // activeMenu.value = azRoute[azRoute.length - 1]
//     activeKey.value = r.fullPath.split("?")[0];
//     expandedKeys.value = azRoute.slice(0, -1);
//     // console.log(activeKey.value)
//   },
//   {
//     deep: true,
//     immediate: true,
//   },
// );

watchEffect(() => {
    const azRoute = route.fullPath.split('?')[0].split('/').slice(1)
    activeKey.value = route.fullPath.split('?')[0]
    expandedKeys.value = azRoute.slice(0, -1)
})
// function transformMenuOptionByRoute(routes: RouteRecordRaw[]) {
//     const options: any[] = []
//     routes.forEach((item: RouteRecordRaw) => {
//         // 在侧边菜单栏中隐藏该项
//         if (item.meta?.hideInMenu) return
//         if (item.children) {
//             options.push({
//                 // label: renderLabel(item),
//                 label: item.meta?.title,
//                 key: item.path.split('/').slice(1)[0],
//                 icon: renderIcon(item.meta?.icon as Component),
//                 children: transformMenuOptionByRoute(item.children),
//                 order: item.meta?.order
//             })
//         } else {
//             if (item.meta?.icon) {
//                 options.push({
//                     label: renderLabel(item),
//                     key: item.path,
//                     icon: renderIcon(item.meta?.icon as Component),
//                     order: item.meta?.order
//                 })
//             } else {
//                 options.push({
//                     label: renderLabel(item),
//                     key: item.path,
//                     order: item.meta?.order
//                 })
//             }
//         }
//     })
//     return useSorted(options, (a, b) => a.order - b.order).value
// }

// const menuOptions = ref<
//     Array<MenuOption | MenuDividerOption | MenuGroupOption>
// >([])

// 转换菜单列表，将菜单树中的隐藏项移除
function transformMenuOption(options: RouteRecordRaw[]) {
    return options.filter((item) => {
        if (item.children) {
            const arr = transformMenuOption(item.children)
            if (arr.length === 0) {
                delete item.children
            } else {
                item.children = arr
            }
        }
        return !item.meta?.hide
    })
}
const commonStore = useCommonStore()
const { transformMenuOptionByRemoteData } = useMenu()

async function handleAuthMenu() {
    await commonStore.getMenuList()
}

const menuList = computed(() =>
    transformMenuOptionByRemoteData(commonStore.menuList)
)

onMounted(() => {
    // const filteredRoutes = transformMenuOption(routes)
    // menuOptions.value = [...transformMenuOptionByRoute(filteredRoutes)]

    if (menuList.value.length <= 0) {
        handleAuthMenu()
    }
})

function handleUpdateMenu(_key: string, item: MenuOption) {
    const menuItem = item as App.GlobalMenuOption
    // router.push(menuItem.routePath)
}

function handleUpdateExpandedKeys(keys: string[]) {
    expandedKeys.value = keys
}
</script>
