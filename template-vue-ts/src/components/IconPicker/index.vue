<template>
    <n-popover trigger="click" placement="bottom-start" :show-arrow="false">
        <template #trigger>
            <n-input v-model:value="value" clearable readonly>
                <template #prefix v-if="value">
                    <Icon :icon="value" class="text-20px" />
                </template>
            </n-input>
        </template>

        <n-input
            v-model:value="keyword"
            @update:value="handleSearchThrottle"
            placeholder="请输入想要的图标名称"
        />
        <div
            class="flex gap-2px flex-wrap my-4 max-w-420px max-h-300px overflow-auto"
        >
            <n-tooltip v-for="icon in iconList" :key="icon.value">
                <template #trigger>
                    <div
                        class="w-40px h-40px flex-center cursor-pointer b-1 b-dashed hover:b-solid hover:b-blue-5"
                        :class="
                            value === icon.value
                                ? 'b-blue-400 b-solid! text-blue-500'
                                : 'b-gray-4'
                        "
                        @click="handleSelectIcon(icon.value)"
                    >
                        <Icon :icon="icon.value" class="text-28px" />
                    </div>
                </template>
                {{ icon.label }}
            </n-tooltip>
        </div>
        <n-pagination
            :page="pagination.page"
            :page-size="pagination.pageSize"
            :item-count="originIconList.length"
            @update:page="handlePageChange"
        />
    </n-popover>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { icons } from '@iconify-json/hugeicons'
import { useThrottleFn } from '@vueuse/core'

const value = defineModel('value', {
    type: String,
    required: true,
    default: ''
})

const originIconList = Object.keys(icons.icons).map((item) => {
    return {
        label: item,
        value: `hugeicons:${item}`
    }
})

const pagination = ref({
    page: 1,
    pageSize: 60
})
const iconList = ref<any[]>(originIconList.slice(0, pagination.value.pageSize))

const handlePageChange = (page: number) => {
    const start = page * pagination.value.pageSize
    const end = start + pagination.value.pageSize
    iconList.value = originIconList.slice(start, end)
    pagination.value.page = page
}

const handleSelectIcon = (icon: string) => {
    value.value = icon
}

const keyword = ref('')

const handleSearch = (e) => {
    keyword.value = e
    if (!keyword.value) {
        iconList.value = originIconList.slice(0, pagination.value.pageSize)
        return
    }
    const list = originIconList.filter((item) =>
        item.label.includes(keyword.value)
    )
    iconList.value = list.slice(0, pagination.value.pageSize)
}

const handleSearchThrottle = useThrottleFn(handleSearch, 300)
</script>
