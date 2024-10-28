<template>
    <n-cascader
        :value="value"
        :placeholder="placeholder"
        :options="options"
        :check-strategy="checkStrategyIsChild ? 'child' : 'all'"
        :show-path="showPath"
        clearable
        remote
        @update:value="handleUpdateValues"
        @load="handleLoad"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { CascaderOption } from 'naive-ui'
import { useCommonStore } from '@/store'

defineOptions({ name: 'AreaCodeField' })

// type Valueble = string | number | Array<number | string> | null
type Valueble = any

interface AreaCodeFieldProps {
    checkStrategyIsChild?: boolean
    value: Valueble
    defaultValue?: string | string[]
    placeholder?: string
    showAllLevels?: boolean
}

const commonStore = useCommonStore()

const { checkStrategyIsChild, placeholder, defaultValue, showAllLevels } =
    withDefaults(defineProps<AreaCodeFieldProps>(), {
        checkStrategyIsChild: true,
        placeholder: '请选择所属地区',
        showAllLevels: false
    })

interface Emits {
    (e: 'update:value', value: Valueble): void
    (e: 'update:valueAll', valuee: string[]): void
}

const emit = defineEmits<Emits>()

const showPath = ref(true)
const areaCode = ref()

const options = ref<CascaderOption[]>()

const handleUpdateValues = (
    value: string | number | Array<string | number> | null,
    option: CascaderOption | Array<CascaderOption | null> | null,
    pathValues:
        | Array<CascaderOption | null>
        | Array<CascaderOption[] | null>
        | null
) => {
    if (showAllLevels) {
        const values: string[] = []
        Array.isArray(pathValues) &&
            pathValues.forEach((item: any) => {
                values.push(item.value)
            })
        emit('update:valueAll', values)
    }
    emit('update:value', value)
}

async function getAreaList(areaCode: string, depth: number = 1) {
    const data = await commonStore.getAreaList(areaCode)

    return data.map((item: any) => {
        let isTown = false
        if (!/0{3}$/g.test(item.code)) {
            isTown = true
        }
        return {
            label: item.name,
            value: item.code + '',
            depth: depth,
            isLeaf: isTown
        }
    })
}

async function getFirstAreaList(areaCode: string = '370000000') {
    options.value = await getAreaList(areaCode)
}

const areaListToTreeData = computed(() => {
    let pid = ''
    if (Array.isArray(defaultValue)) {
        return defaultValue.map((element, index) => {
            pid = element
            if (index === 0) {
                return {
                    id: element,
                    value: element,
                    pid: 'root'
                }
            }
            return {
                id: element,
                value: element,
                pid
            }
        })
    }
    return []
})

/** TODO 如何回显 */
function toTree(data: any[]) {
    let parentList: any[] = []
    const obj: any = {}

    data.forEach((item) => (obj[item.id] = item))

    data.forEach((item) => {
        const parent = obj[item.pid]
        commonStore.getAreaList(item.id).then((d) => {
            if (parent) {
                parent.children = parent.children || []
                parent.children.push(item)
            } else {
                parentList.push(item)
            }
        })
    })
    return parentList
}

async function getChildren(option: CascaderOption) {
    const children: {
        label: any
        value: any
        depth: number
        isLeaf: boolean
    }[] = []

    const data = await commonStore.getAreaList(option.value)

    data.forEach((item: any) => {
        let isTown = false
        if (!/0{3}$/g.test(item.code)) {
            isTown = true
        }
        children.push({
            label: item.name,
            value: item.code,
            depth: (option as { depth: number }).depth + 1,
            isLeaf: isTown
        })
    })

    return children
}

const handleLoad = async (option: CascaderOption) => {
    return new Promise<void>(async (resolve) => {
        option.children = await getChildren(option)
        resolve()
    })
}

watch(areaCode, (newValue) => {
    emit('update:value', newValue)
})

onMounted(() => {
    if (defaultValue) {
        toTree(areaListToTreeData.value)
    } else {
        getFirstAreaList()
    }
})
</script>
