<template>
    <n-modal
        v-model:show="modalVisible"
        preset="card"
        :title="title"
        class="w-800px"
    >
        <n-form class="w-100%" label-placement="left">
            <n-form-item label="当前版本">
                <span>{{ props.data?.version }}</span>
            </n-form-item>
            <n-form-item label="版本列表">
                <div class="flex w-100% gap-16px">
                    <n-select
                        ref="versionSelectRef"
                        class="w-100%"
                        v-model:value="version"
                        :options="packageOptions"
                        label-field="version"
                        value-field="id"
                        placeholder="请选择固件版本号"
                    />
                    <n-button
                        type="primary"
                        :loading="loading"
                        @click="handleUpgrade"
                        >升级</n-button
                    >
                </div>
            </n-form-item>
        </n-form>

        <n-card title="升级进度" size="small">
            <n-progress
                type="line"
                :percentage="progress"
                :status="status"
                :indicator-placement="'inside'"
                :processing="loading"
            />
        </n-card>
    </n-modal>
</template>

<script setup lang="ts">
import { useUpgradeManageStore } from '../store'
import { Status } from 'naive-ui/es/progress/src/interface'

export type UpgradeData = {
    id: string
    version: string
    siteName: string
    tankerName: string
}

interface Props {
    visible: boolean
    type: string
    data: UpgradeData
}

const props = defineProps<Props>()

const emit = defineEmits(['update:visible'])

const title = computed(() =>
    props.type === '2'
        ? '版本升级'
        : props.type === '1'
          ? '升级4G固件'
          : '升级MCU'
)

const modalVisible = computed({
    get() {
        return props.visible
    },
    set(visible) {
        emit('update:visible', visible)
    }
})

const store = useUpgradeManageStore()

const version = ref(null)
const packageOptions = computed(
    () =>
        (props.type === '1'
            ? store.packageListWith4G
            : store.packageListWithMCU) || []
)

onMounted(() => {
    if (props.type && packageOptions.value.length <= 0) {
        const result = store.getPackageList(props.type)
    }
})

const progress = ref(0)
const isPlaying = ref(false)
const isCompleted = ref(false)

// 进度条动画
const animationProgress = (target: number, duration: number) => {
    return new Promise<void>((resolve, _reject) => {
        let start = progress.value
        const end = target
        // const duration = (target - start) * 150;

        const startTime = Date.now()

        const doAnimation = () => {
            const elapsed = Date.now() - startTime
            const cur_progress = Math.min(elapsed / duration, 1)
            progress.value = Number(
                (start + (end - start) * cur_progress).toFixed(2)
            )

            if (cur_progress === 1) {
                resolve()
            } else if (isCompleted.value) {
                resolve()
            } else {
                requestAnimationFrame(doAnimation)
            }
        }

        requestAnimationFrame(doAnimation)
    })
}

const message = useMessage()
const versionSelectRef = ref<any>(null)

const status = ref<Status>('info')
const loading = ref(false)
const handleUpgrade = () => {
    if (!version.value) {
        message.warning('请选择要升级的版本')
        versionSelectRef.value?.focus()
        return
    }
    // 模拟升级中
    loading.value = true
    status.value = 'info'
    isPlaying.value = true
    progress.value = 0
    animationProgress(90, 1000).then(() => {
        if (!isCompleted.value) {
            animationProgress(100, 500)
        }
        const { id } = props.data
        store
            .upgradePackage({
                id: String(id),
                type: props.type,
                urlId: String(version.value)
            })
            .then(() => {
                status.value = 'success'
                loading.value = false
            })
            .catch(() => {
                status.value = 'error'
                loading.value = false
            })
    })
}
</script>
