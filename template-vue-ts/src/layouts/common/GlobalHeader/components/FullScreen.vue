<template>
    <n-tooltip trigger="hover">
        <template #trigger>
            <n-button
                type="default"
                circle
                quaternary
                size="small"
                :class="theme === 'light' ? 'light' : 'dark'"
                @click="toggle"
            >
                <template #icon>
                    <icon-ant-design-fullscreen-exit-outlined
                        v-if="isFullscreen"
                        class="text-18px cursor-pointer"
                    />
                    <icon-ant-design-fullscreen-outlined
                        v-else
                        class="text-18px cursor-pointer"
                    />
                </template>
            </n-button>
        </template>
        {{ isFullscreen ? '退出全屏' : '全屏' }}
    </n-tooltip>
</template>

<script lang="ts" setup>
import { useFullscreen } from '@vueuse/core'

defineOptions({ name: 'FullScreen' })

interface FullScreenProps {
    theme?: 'light' | 'dark'
}

const { theme = 'light' } = defineProps<FullScreenProps>()

const { isFullscreen, toggle } = useFullscreen()
</script>

<style scoped lang="scss">
.light {
    color: #333;
}
.dark {
    color: #fff;
}
</style>
