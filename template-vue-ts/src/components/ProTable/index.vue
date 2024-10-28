<template>
    <!--  <n-card bordered class="shadow-sm">-->
    <!--    <n-form ref="searchFormRef" :model="searchFormData" label-placement="left" label-width="auto" inline size="small" :show-feedback="false">-->
    <!--      <n-grid-->
    <!--:x-gap="12" :y-gap="8" cols="1 s:2 m:3 l:4" :collapsed="gridCollapsed" :collapsed-rows="1"-->
    <!--        responsive="screen" ref="searchGrid">-->
    <!--        <template v-for="item in columns" :key="item.key">-->
    <!--          <n-form-item-gi-->
    <!--:path="item.key" :label="item.title"-->
    <!--            v-if="!item.hideInSearch && item.key !== 'index' && item.key !== 'actions'">-->
    <!--            <n-select-->
    <!--v-if="item.valueType === 'select'" :options="item.filterOptions" v-model:value="searchForm[item.key]"-->
    <!--              :placeholder="`请输入${item.title}`" :clearable="true" />-->
    <!--            <n-date-picker-->
    <!--v-else-if="item.valueType === 'date'" v-model:formatted-value="searchForm[item.key]"-->
    <!--              value-format="yyyy-MM-dd" type="date" :placeholder="`请输入${item.title}`" clearable />-->
    <!--            <n-input v-else v-model:value="searchForm[item.key]" :placeholder="`请输入${item.title}`" clearable />-->
    <!--          </n-form-item-gi>-->
    <!--        </template>-->
    <!--        <n-form-item-gi suffix class="suffix flex justify-end">-->
    <!--          <n-space>-->
    <!--            <n-button @click="handleReset">-->
    <!--              <template #icon>-->
    <!--                <icon-ic-round-refresh />-->
    <!--              </template>-->
    <!--              重置-->
    <!--            </n-button>-->
    <!--            <n-button @click="handleSearch">-->
    <!--              <template #icon>-->
    <!--                <icon-ant-design-search-outlined />-->
    <!--              </template>-->
    <!--              查询-->
    <!--            </n-button>-->
    <!--            <n-button class="lt-md:flex" @click="() => toggleGridCollapsed()">-->
    <!--              <template #icon>-->
    <!--                <icon-ic-round-expand-more v-if="gridCollapsed" />-->
    <!--                <icon-ic-round-expand-less v-else />-->
    <!--              </template>-->
    <!--              {{ gridCollapsed === false ? "折叠" : "展开" }}-->
    <!--            </n-button>-->
    <!--          </n-space>-->
    <!--        </n-form-item-gi>-->
    <!--      </n-grid>-->
    <!--    </n-form>-->
    <!--  </n-card>-->
    <n-card class="flex-1 mt-12px shadow-sm lt-md:hidden" :title="pageTitle">
        <template #header-extra>
            <n-space>
                <n-button
                    v-if="createButton"
                    type="info"
                    size="small"
                    secondary
                    @click="handleAdd"
                >
                    <template #icon>
                        <icon-ant-design-plus-outlined />
                    </template>
                    {{ createButtonText || '新增' }}
                </n-button>
                <n-button-group>
                    <n-tooltip trigger="hover">
                        <template #trigger>
                            <n-button
                                size="small"
                                quaternary
                                @click="() => loadData(1)"
                            >
                                <icon-mdi-refresh
                                    class="mr-4px lt-sm:mr-0 text-16px"
                                    :class="{ 'animate-spin': loading }"
                                />
                            </n-button>
                        </template>
                        刷新
                    </n-tooltip>
                    <n-dropdown
                        @select="handleSelectForTableSize"
                        trigger="click"
                        :options="[
                            { label: '默认', key: 'large' },
                            { label: '中等', key: 'medium' },
                            { label: '紧凑', key: 'small' }
                        ]"
                    >
                        <n-tooltip trigger="hover">
                            <template #trigger>
                                <n-button size="small" quaternary>
                                    <template #icon>
                                        <icon-ant-design-column-height-outlined
                                            class="text-18px"
                                        />
                                    </template>
                                </n-button>
                            </template>
                            密度
                        </n-tooltip>
                    </n-dropdown>
                    <column-setting v-model:columns="columnsData" secondary />
                </n-button-group>
            </n-space>
        </template>
        <n-data-table
            ref="tableRef"
            v-bind="$attrs"
            remote
            :columns="tableColumns"
            :data="dataSource"
            :loading="loading"
            :pagination="pagination"
            :size="size"
            :row-key="rowKey"
            @update:page="handlePageChange"
            @update:page-size="handlePageSizeChange"
            @update:checked-row-keys="handleCheck"
            :bordered="false"
        />
    </n-card>
</template>

<script lang="ts" setup>
import { useToggle, useWindowSize } from '@vueuse/core'
import { ProTableColumns } from '@/components/ProTable/types'

interface SearchConfig {
    formItems: any[]
    formRules: any[]
    formModel: any
    labelWidth: string | 'auto'
    labelAlign: 'left' | 'right'
    labelPlacement: 'left' | 'right' | 'top' | 'bottom'
    size?: 'small' | 'medium' | 'large'
    showAdvancedButton: boolean
    showResetButton: boolean
    submitButtonText: string
    resetButtonText: string
}

interface ProTableProps {
    columns: ProTableColumns<any>
    loading: boolean
    pageTitle: string
    dataSource?: any[]
    pagination?: false | object
    searchConfig?: SearchConfig
    rowKey: any
    createButtonText?: string
    createButton?: boolean
}

interface Emits {
    (e: 'loadData', page: number): void
    (e: 'createMethod'): void
    (e: 'update:pageSize', pageSize: number): void
    (e: 'update:page', page: number): void
    (
        e: 'update:checked',
        keys: Array<string | number>,
        rows: object[],
        meta: {
            row: object | undefined
            actions: 'check' | 'uncheck' | 'checkAll' | 'uncheckAll'
        }
    ): void
}

const [gridCollapsed, toggleGridCollapsed] = useToggle(true)

const {
    columns,
    pageTitle,
    loading,
    dataSource,
    rowKey,
    pagination,
    createButton
} = defineProps<ProTableProps>()

const emit = defineEmits<Emits>()

const columnsData = ref(columns)

// const showCreateButton = computed(() => {
//   return emit('createMethod')
// })

const tableColumns = computed(() => {
    return columnsData.value.filter((item: any) => {
        return !item.hideInTable
    })
})

type TableSize = 'small' | 'medium' | 'large' | undefined
const size = ref<TableSize>('medium')

const handleSelectForTableSize = (key: TableSize) => {
    size.value = key
}

const searchFormRef = ref(null)

const searchFormData = ref({
    // 初始化搜索表单的值
})

const createSearchFormData = () => ({})

// eslint-disable-next-line vue/no-dupe-keys
const loadData = (page: number) => {
    emit('loadData', page)
}

const handleAdd = () => {
    emit('createMethod')
}

const handleSearch = () => {
    loadData(1)
}

const handleReset = () => {
    // 重置搜索表单
    loadData(1)
}

const handlePageSizeChange = (pageSize: number) => {
    emit('update:pageSize', pageSize)
}

const handlePageChange = (page: number) => {
    emit('update:page', page)
}

const handleCheck = (keys: (string | number)[], rows: object[], meta: any) => {
    emit('update:checked', keys, rows, meta)
}

const { height } = useWindowSize()
const tableHeight = computed(() => {
    return height.value - 340
})
</script>
