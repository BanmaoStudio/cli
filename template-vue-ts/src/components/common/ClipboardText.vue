<template>
    <n-text v-if="isSupported" class="flex-y-center">
        <span style="white-space: nowrap" class="ellipsis">
            <!-- <slot /> -->
            {{ text }}
        </span>
        <!-- <n-tooltip> -->
        <!-- <template #trigger> -->
        <n-button text @click="handleCopy">
            <icon-ant-design-check-outlined
                class="text-green-500"
                v-if="isCopied"
            />
            <icon-ant-design:copy-outlined class="text-blue-500" v-else />
        </n-button>
        <!-- </template> -->
        <!-- 复制 -->
        <!-- </n-tooltip> -->
    </n-text>
    <n-text v-else>
        {{ text }}
    </n-text>
</template>

<script setup lang="ts">
import type { TextProps } from 'naive-ui'
import { useClipboard } from '@vueuse/core'

defineOptions({ name: 'ClipBoardText' })

interface Props {
    text: string
    ellipsis?: boolean
}

const props = defineProps<Props>()

const { text, ellipsis } = toRefs(props)

const isCopied = ref(false)

const {
    text: _clipBoardText,
    isSupported,
    copy
} = useClipboard({ legacy: true })

const handleCopy = () => {
    if (!text.toString()) {
        return
    }
    copy(text.value.toString())

    isCopied.value = true
    setTimeout(() => {
        isCopied.value = false
    }, 3000)
}
</script>
