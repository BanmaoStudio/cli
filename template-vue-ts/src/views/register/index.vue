<template>
    <n-layout
        class="nox-container w-100% h-screen"
        :naive-scrollbar="false"
        :content-style="{ width: '100%' }"
    >
        <!-- <nox-header
      title="注册加油机"
      @back="handleToLogin"
      v-if="props.hiddenHeader === false"
    /> -->
        <div class="max-w-860px flex flex-col items-center mx-auto">
            <n-steps :current="current" class="mt-10">
                <n-step title="注册" />
                <n-step title="填写油站信息" />
                <n-step title="填写油机信息" />
                <n-step title="结果" />
            </n-steps>
            <div v-show="pageType === 'init'" class="md:w-860px mt-4">
                <register-form @submit="handleStepToBasic" />
                <!-- <n-divider />
        <change-form @submit="handleStepToBasic" /> -->
            </div>
            <div v-show="pageType === 'basic'" class="md:w-860px mt-4">
                <station-form @prev="handlePrev" @next="handleNext" />
            </div>
            <div v-show="pageType === 'machine'" class="md:w-860px mt-4">
                <machine-form
                    title="油机信息"
                    @prev="handlePrevToBasic"
                    @save="handleSubmit"
                />
            </div>
            <div v-show="pageType === 'result'" class="md:w-860px mt-4">
                <div class="flex-center shadow md:shadow-xl min-h-600px">
                    <n-result
                        status="success"
                        description="注册中"
                        v-if="resultData"
                    >
                        <template #icon>
                            <n-descriptions
                                :column="1"
                                bordered
                                label-placement="left"
                            >
                                <n-descriptions-item label="油站名称">{{
                                    resultData?.siteName
                                }}</n-descriptions-item>
                                <n-descriptions-item label="4G模块信号强度">{{
                                    resultData?.sk4gSignalIntensity
                                }}</n-descriptions-item>
                                <n-descriptions-item label="MCU版本">{{
                                    resultData?.skMcuFirmwareVer
                                }}</n-descriptions-item>
                                <n-descriptions-item label="4G固件版本">{{
                                    resultData?.sk4gFirmwareVer
                                }}</n-descriptions-item>
                                <n-descriptions-item label="物联网卡IMEI">{{
                                    resultData?.sk4gImei
                                }}</n-descriptions-item>
                                <n-descriptions-item label="物联网卡ICCID">{{
                                    resultData?.skSimCcid
                                }}</n-descriptions-item>
                            </n-descriptions>
                        </template>
                        <n-data-table
                            :columns="resultColumns"
                            :data="dataSource"
                        />
                        <template #footer>
                            <n-space>
                                <n-button @click="handleToLogin"
                                    >返回注册列表页</n-button
                                >
                                <n-button
                                    type="primary"
                                    @click="handleToRegisterAgain"
                                    >继续注册</n-button
                                >
                            </n-space>
                        </template>
                    </n-result>
                    <n-result status="error" description="注册失败" v-else>
                        <template #footer>
                            <n-space>
                                <n-button @click="handleToLogin"
                                    >返回注册列表页</n-button
                                >
                                <n-button
                                    v-if="resultData"
                                    type="primary"
                                    @click="handleToRegisterAgain"
                                    >继续注册</n-button
                                >
                                <n-button
                                    v-else
                                    @click="handleReSignup"
                                    type="primary"
                                    >返回上一部，重新注册</n-button
                                >
                            </n-space>
                        </template>
                    </n-result>
                </div>
            </div>
        </div>

        <div class="radial radial_square"></div>
        <div class="dress"></div>
        <div class="radial radial_circle"></div>
    </n-layout>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import RegisterForm from './components/RegisterForm.vue'
// import ChangeForm from "./components/ChangeForm.vue";
import StationForm from './components/StationForm.vue'
import MachineForm from './components/MachineForm.vue'
import NoxHeader from '@/components/common/NoxHeader.vue'
import { useRouter } from 'vue-router'
import { useRegisterMachineStore } from './store'
import { RegisterResultData } from './types'
// import { useDeviceRegisterListStore } from '../device_register_list/store'
const store = useRegisterMachineStore()
const props = withDefaults(defineProps<{ hiddenHeader?: boolean }>(), {
    hiddenHeader: false
})
const resultColumns = [
    { title: '序号', key: 'index', width: 80, align: 'center' },
    { title: '枪号', key: 'gunNo', align: 'center' },
    { title: '报警内容', key: 'msg', align: 'center' },
    {
        title: '状态',
        key: 'status',
        align: 'center',
        render: (record) => (record.status === '0' ? '未恢复' : '已恢复')
    },
    { title: '报警时间', key: 'createTime', align: 'center' },
    { title: '恢复时间', key: 'recoveryTime', align: 'center' }
]
type tableDate = {
    gunNo: number //枪号
    msg: string //报警内容
    status: string //状态
    createTime: string //报警时间
    recoveryTime: string //恢复时间
}
const dataSource = ref<tableDate[]>([])

const message = useMessage()
const router = useRouter()

const pageType = ref('init')
const current = ref(1)

const handleStepToBasic = () => {
    pageType.value = 'basic'
    current.value++
}

const handlePrev = () => {
    pageType.value = 'init'
    current.value--
}

const handlePrevToBasic = async () => {
    try {
        if (store.formData.skDeviceSn) {
            const result = await store.getMachineFormDataByRemote({
                skDeviceSn: store.formData.skDeviceSn
            })
            if (result && result.status === 0) {
                pageType.value = 'basic'
                current.value--
            } else {
                message.error('该序列号不存在')
            }
        }
    } catch (err) {}
}

const handleNext = () => {
    pageType.value = 'machine'
    current.value++
}

interface ResultData extends RegisterResultData {
    siteName: string
}
const resultData = ref<ResultData | null>({
    siteName: '',
    sk4gFirmwareVer: '',
    sk4gImei: '',
    sk4gSignalIntensity: '',
    skMcuFirmwareVer: '',
    skSimCcid: '',
    gunNo: '', //枪号
    msg: '', //报警内容
    status: '', //状态
    createTime: '', //报警时间
    recoveryTime: 'tring' //恢复时间
})

const handleSubmit = (data: any) => {
    if (data && data.skAlarmRecords) {
        const transformedData = data.skAlarmRecords.map((record) => ({
            gunNo: record.gunNo,
            msg: record.msg,
            status: record.status,
            createTime: record.createTime,
            recoveryTime: record.recoveryTime
        }))
        // 更新dataSource
        dataSource.value = transformedData
        dataSource.value.forEach((item, index) => {
            // 将index + 1赋给item作为序号，因为数组索引从0开始，而我们的序号从1开始
            item.index = index + 1
        })
    }
    pageType.value = 'result'
    current.value++

    resultData.value = data
}

const handleToRegisterAgain = () => {
    store.resetFormData()

    pageType.value = 'init'
    current.value = 1
}

const handleReSignup = () => {
    pageType.value = 'machine'
    current.value = 3
}

const handleToLogin = () => {
    router.push('/device_register_list')
}
</script>

<style lang="scss" scoped>
:deep(.n-result .n-result-footer) {
    margin-bottom: 20px;
}
.nox-container {
    position: relative;
    @apply flex flex-col items-center;
    background: transparent;
    /* background: linear-gradient(135deg, rgba(#fff, 0.3), rgba(#efe, 0.3)) */
}

@keyframes circle {
    0% {
        transform: rotate(45deg);
    }

    50% {
        transform: rotate(135deg);
    }

    100% {
        transform: rotate(45deg);
    }
}

$size: 400px;

.radial {
    position: absolute;
    width: $size;
    height: $size;
    animation: circle 20s ease-in-out infinite;
    z-index: -1;
}

@keyframes circle-round {
    0% {
        transform: rotate(0);
    }

    50% {
        transform: rotate(180deg);
    }

    100% {
        transform: rotate(360deg);
    }
}

.dress {
    position: absolute;
    bottom: calc($size * -4.7);
    left: 50%;
    /* transform: translateX(-50%); */
    margin-left: calc($size * 5 / -2);
    transform-origin: center 50%;
    width: $size * 5;
    height: $size * 5;
    border-radius: 50%;
    background-image: conic-gradient(#f5f7fa 0%, #657fa9 50%, #f5f7fa 100%);
    animation: circle-round 20s linear infinite;
    z-index: -1;
}

.radial_square {
    left: calc($size / -1.7);
    bottom: calc($size / -1.7);
    background: radial-gradient(circle, rgb(198, 251, 202), rgb(193, 255, 241));
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
    transform: rotate(45deg);
}

.radial_circle {
    width: 1080px;
    height: 1000px;
    left: 70%;
    bottom: -900px;
    /* left: 50%;
  bottom: calc($size/-2); */
    transform: translate(-50%);
    border-radius: 50%;
    background: radial-gradient(
        circle at 50% 50%,
        rgb(104, 106, 126),
        rgb(219, 188, 255)
    );
    box-shadow: 0px 0px 10px 0 rgba(0, 0, 0, 0.3);
}
</style>
