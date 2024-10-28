<template>
    <n-dropdown
        v-if="type !== 'simple'"
        trigger="hover"
        :options="userOptions"
        round
        size="small"
        show-arrow
        @select="handleSelect"
    >
        <n-button
            size="small"
            quaternary
            round
            class="flex-y-center color-#333"
        >
            <n-avatar round :size="20" color="orangered">
                {{ userName }}
            </n-avatar>
            <span class="pl-4px">{{ userName }}</span>
        </n-button>
    </n-dropdown>
    <div v-else class="flex-y-center cursor-pointer">
        <n-avatar round :size="24" color="orangered">
            {{ userName }}
        </n-avatar>
        <span class="pl-8px">{{ userName }}</span>
    </div>
</template>

<script setup lang="ts">
import { localStg } from '@/utils/storage'
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/store'
import { NIcon } from 'naive-ui'
import AntDesignFundOutlined from '~icons/ant-design/fund-outlined'
import AntDesignLogoutOutlined from '~icons/ant-design/logout-outlined'

const message = useMessage()
const router = useRouter()
const authStore = useAuthStore()

interface UserDropdownProps {
    type?: 'simple'
}
const { type } = defineProps<UserDropdownProps>()

// const userName = ref('Admin')

const userName = computed(() => authStore.username)

const renderIcon = (icon: Component, type: 'normal' | 'danger' = 'normal') => {
    return () => {
        return h(
            NIcon,
            type === 'danger'
                ? {
                      style: 'color: #e88080'
                  }
                : null,
            {
                default: () => h(icon)
            }
        )
    }
}

const userOptions = reactive([
    // {
    //   label: '个人中心',
    //   key: 'UserCenter'
    // },
    {
        label: '数据可视化',
        key: 'DataV',
        icon: renderIcon(AntDesignFundOutlined)
    },
    {
        label: '退出登录',
        key: 'Logout',
        icon: renderIcon(AntDesignLogoutOutlined, 'danger')
    }
])

const handleLogout = () => {
    // localStg.clear()
    // router.replace('/login')
    authStore.resetAuthStore()
}

const handleSelect = (key: string | number) => {
    switch (key) {
        case 'UserCenter':
            router.push('/profile')
            break
        case 'DataV':
            // router.push("/dataV");
            console.log('DataVButton')
            break
        case 'Logout':
            handleLogout()
            break
        default:
            break
    }
}
</script>
