<template>
    <n-button circle quaternary size="small" @click="() => toggle()">
        <template #icon>
            <icon-icon-park:color-filter class="text-18px cursor-pointer" />
        </template>
    </n-button>
    <n-drawer v-model:show="visible" :width="402">
        <n-drawer-content title="Theme Setting" closable>
            <div class="flex-center flex-col">
                <n-divider>主题模式</n-divider>
                <n-switch v-model:value="darkMode" size="large">
                    <template #checked-icon>
                        <icon-mdi-moon-waning-crescent class="text-18px" />
                    </template>
                    <template #unchecked-icon>
                        <icon-mdi-white-balance-sunny class="text-18px" />
                    </template>
                </n-switch>

                <n-divider>主题颜色</n-divider>
                <ColorSelect v-model:value="primaryColor" />

                <n-divider>界面显示</n-divider>
                <n-list class="w-full">
                    <n-list-item>
                        <span>显示面包屑导航</span>
                        <template #suffix>
                            <n-switch v-model:value="showBreadcrumb" />
                        </template>
                    </n-list-item>
                    <n-list-item>
                        <span>显示多页签</span>
                        <template #suffix>
                            <n-switch v-model:value="multiTabbar" />
                        </template>
                    </n-list-item>
                </n-list>
            </div>
        </n-drawer-content>
    </n-drawer>
</template>

<script lang="ts" setup>
import { defineOptions } from 'vue'
import { useToggle } from '@vueuse/core'
import { useThemeStore } from '@/store'

import ColorSelect from './components/ColorSelect.vue'

defineOptions({ name: 'ThemeSetting' })

const [visible, toggle] = useToggle(false)

const theme = useThemeStore()

const darkMode = computed({
    get: () => theme.darkMode,
    set: (val) => {
        theme.setDarkMode(val)
    }
})

const primaryColor = computed({
    get: () => theme.themeColor,
    set: (val) => {
        theme.setThemeColor(val)
    }
})

const showBreadcrumb = computed({
    get: () => theme.header.crumb.visible,
    set: (val) => {
        theme.setShowBreadcrumb(val)
    }
})

const multiTabbar = computed({
    get: () => theme.tab.visible,
    set: (val) => {
        theme.setMultiTabbar(val)
    }
})
</script>
