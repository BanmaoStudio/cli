<script setup lang="ts">
import {
    darkTheme,
    GlobalThemeOverrides,
    useOsTheme,
    zhCN,
    dateZhCN
} from 'naive-ui'
import { computed } from 'vue'
import { useThemeStore } from '@/store'

defineOptions({ name: 'App' })

// 获取系统主题色
const osThemeRef = useOsTheme()

const themeStore = useThemeStore()

const setOsTheme = () => {
    ;(osThemeRef.value === 'dark' || themeStore.darkMode) &&
        document.getElementsByTagName('html')[0].classList.add('dark')
}

const theme = computed(() => {
    // return osThemeRef.value === 'dark' || themeStore.darkMode ? darkTheme : null
    return themeStore.darkMode ? darkTheme : null
})

const themeOverrides = computed<GlobalThemeOverrides>(() => ({
    common: {
        primaryColor: themeStore.themeColor,
        primaryColorHover: '#438aff',
        primaryColorPressed: '#438aff'
    },
    Button: {
        textColor: '#437cff'
    }
}))

function init() {
    setOsTheme()
}

init()
</script>

<template>
    <n-config-provider
        :theme="theme"
        :theme-overrides="themeOverrides"
        :date-locale="dateZhCN"
        :locale="zhCN"
    >
        <n-message-provider>
            <naive-provider>
                <router-view />
            </naive-provider>
        </n-message-provider>
    </n-config-provider>
</template>
