<template>
    <n-tooltip trigger="hover">
        <template #trigger>
            <n-button
                type="default"
                circle
                quaternary
                size="small"
                class="color-#333"
                @click="handleRoute"
            >
                <icon-ant-design-fund-outlined class="text-18px" />
            </n-button>
        </template>
        数据可视化
    </n-tooltip>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineOptions({ name: 'DataVButton' })

const router = useRouter()
const handleRoute = () => {
    // router.push("/dataV");
    console.log('DataVButton')
}
</script>
