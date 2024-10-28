import { h, onMounted, ref } from 'vue'
import { Icon } from '@iconify/vue'
import { RouterLink } from 'vue-router'
import { useSorted } from '@vueuse/core'

export function useMenu(request?: () => Promise<any>) {
    const menuList = ref<any[]>([])

    onMounted(async () => {
        if (request) {
            const res = await request()
            if (res) menuList.value = transformMenuOptionByRemoteData(res)
        }
    })

    function transformMenuOptionByRemoteData(menuOptions: any[]) {
        const options: any[] = []

        menuOptions.forEach((item) => {
            if (item.state) return
            if (item.children && item.children.length > 0) {
                options.push({
                    label: item.name,
                    key: item.url.split('/').slice(1)[0],
                    icon: () => h(Icon, { icon: item.icon }),
                    children: transformMenuOptionByRemoteData(item.children),
                    order: item.weight
                })
            } else {
                // options.push({
                //     label: () =>
                //         h(RouterLink, { to: item.url }, () => item.name),
                //     key: item.url,
                //     order: item.weight
                // })
                if (item.icon) {
                    options.push({
                        label: () =>
                            h(RouterLink, { to: item.url }, () => item.name),
                        key: item.url,
                        icon: () => h(Icon, { icon: item.icon }),
                        order: item.weight
                    })
                } else {
                    options.push({
                        label: () =>
                            h(RouterLink, { to: item.url }, () => item.name),
                        key: item.url,
                        order: item.weight
                    })
                }
            }
        })

        return useSorted(options, (a, b) => a.order - b.order).value
    }

    return { menuList, transformMenuOptionByRemoteData }
}
