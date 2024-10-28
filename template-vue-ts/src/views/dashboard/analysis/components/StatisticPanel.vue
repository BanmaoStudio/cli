<template>
    <n-card
        class="rounded bg-gradient-to-t from-#accbee/50 to-transparent to-75%"
    >
        <n-space items="center">
            <Icon icon="fluent-emoji-flat-fuel-pump" class="text-64px" />
            <n-statistic v-if="total" tabular-nums>
                <template #label>
                    <span>{{ label }}</span>
                </template>
                <template #default>
                    <n-space>
                        <n-number-animation
                            ref="numberAnimationInstRef"
                            :from="lastTotal"
                            :to="total"
                        />
                        <n-text type="success" class="text-12px">
                            <icon-ant-design-arrow-up-outlined />
                            {{ percent }}%
                        </n-text>
                    </n-space>
                </template>
            </n-statistic>
            <n-space v-else>
                <n-skeleton></n-skeleton>
                <n-skeleton></n-skeleton>
            </n-space>
        </n-space>
    </n-card>
</template>
<script setup lang="ts">
import type { NumberAnimationInst } from 'naive-ui'

export interface StatisticPanelProps {
    label: string
    total: number
    lastTotal: number
    percent: number
}

const { label, total, lastTotal, percent } = defineProps<StatisticPanelProps>()
const numberAnimationInstRef = ref<NumberAnimationInst | null>(null)

watch(
    () => total,
    (val, oldVal) => {
        if (val !== oldVal) {
            numberAnimationInstRef.value?.play()
        }
    },
    {
        immediate: true
    }
)
</script>
