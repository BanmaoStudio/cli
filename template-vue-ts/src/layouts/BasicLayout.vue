<template>
    <n-layout
        class="h-screen"
        :content-style="{
            display: 'flex',
            flexDirection: 'column'
        }"
    >
        <global-header>
            <template #breadcrumb>
                <global-breadcrumb v-if="themeStore.header.crumb.visible" />
            </template>
        </global-header>
        <n-layout
            :content-style="{
                display: 'flex',
                flexDirection: 'column',
                flex: 'auto'
            }"
            has-sider
        >
            <global-sider class="lt-sm:hidden" />
            <n-layout-content class="relative bg-gray-100">
                <template v-if="themeStore.tab.visible">
                    <global-tab class="lt-sm:hidden absolute-tl z-999" />
                    <div class="h-40px"></div>
                </template>
                <global-content />
            </n-layout-content>
        </n-layout>
    </n-layout>
    <global-watermark :content="watermark_content" />
</template>

<script setup lang="tsx">
import GlobalHeader from './common/GlobalHeader/index.vue'
import GlobalTab from './common/GlobalTab/index.vue'
import GlobalBreadcrumb from './common/GlobalBreadcrumb/index.vue'
import GlobalContent from './common/GlobalContent/index.vue'
import GlobalWatermark from './common/GlobalWatermark/index.vue'
import GlobalSider from './common/GlobalSider/index.vue'

import { computed } from 'vue'
import { useAuthStore, useThemeStore } from '@/store'

const authStore = useAuthStore()
const themeStore = useThemeStore()

const watermark_content = computed(() => {
    const content: string = authStore.watermark

    return content
})
</script>
