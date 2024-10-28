<template>
    <n-card class="shadow">
        <template #header v-if="props.title">
            <n-h2 class="text-center mb-0">{{ props.title }}</n-h2>
        </template>
        <n-form
            ref="machineFormRef"
            :model="machineModel"
            :rules="rules"
            label-placement="left"
            label-width="140px"
            require-mark-placement="right-hanging"
            :style="{ maxWidth: '1020px' }"
        >
            <n-grid>
                <n-form-item-gi :span="12" label="加油机名称" path="tankerName">
                    <n-input
                        v-model:value="machineModel.tankerName"
                        placeholder="请输入加油机名称"
                        clearable
                    />
                </n-form-item-gi>
                <n-form-item-gi :span="12" label="加油机编号" path="skDeviceSn">
                    <n-input
                        v-if="props.title"
                        v-model:value="machineModel.skDeviceSn"
                        placeholder="请输入加油机编号"
                        clearable
                        disabled
                    />
                    <n-select
                        v-if="!props.title"
                        v-model:value="machineModel.skDeviceSn"
                        filterable
                        placeholder="请输入加油机编号"
                        :options="skDeviceSnOptions"
                    />
                </n-form-item-gi>
                <n-form-item-gi :span="12" label="出厂编号" path="factoryNum">
                    <n-input
                        v-model:value="machineModel.factoryNum"
                        placeholder="请输入出厂编号"
                        clearable
                    />
                </n-form-item-gi>
                <n-form-item-gi :span="12" label="厂家名称" path="factoryName">
                    <n-select
                        v-model:value="machineModel.factoryName"
                        filterable
                        :options="factoriesOptions"
                        clearable
                    />
                </n-form-item-gi>
                <n-form-item-gi :span="12" label="出厂日期" path="factoryTime">
                    <n-date-picker
                        v-model:formatted-value="machineModel.factoryTime"
                        value-format="yyyy-MM-dd"
                        type="date"
                        class="w-100%"
                        clearable
                    />
                </n-form-item-gi>
                <n-form-item-gi
                    :span="12"
                    label="是否连接编码器"
                    path="linkGunOff"
                >
                    <n-select
                        v-model:value="machineModel.linkGunOff"
                        :options="[
                            { label: '连接编码器', value: '1' },
                            { label: '不连接编码器', value: '0' }
                        ]"
                        clearable
                    />
                </n-form-item-gi>
                <n-form-item-gi
                    :span="12"
                    label="是否连接枪开关"
                    path="linkPulse"
                >
                    <n-select
                        v-model:value="machineModel.linkPulse"
                        :options="[
                            { label: '连接枪开关', value: '1' },
                            { label: '不连接枪开关', value: '0' }
                        ]"
                        clearable
                    />
                </n-form-item-gi>
                <!-- <n-form-item-gi :span="12" label="模式选择" path="mode_type">
          <n-select v-model:value="machineModel.mode_type" :options="[
            { label: '无', value: '无' },
            { label: '税口优先-9', value: '税口优先-9' },
          ]" clearable />
        </n-form-item-gi> -->
                <n-form-item-gi :span="12" label="油枪数量" path="gunNum">
                    <n-input-number
                        v-model:value="machineModel.gunNum"
                        clearable
                        class="w-100%"
                        @update:value="createDynamicForm"
                    />
                </n-form-item-gi>
                <n-form-item-gi :span="24" label="绑定关系类型">
                    <n-radio-group
                        v-model:value="currentGunBinding"
                        name="currentGunBinding"
                        @update:value="handleGunBindingChange"
                    >
                        <n-radio-button label="1口1枪" value="port1_to_gun1" />
                        <n-radio-button label="1口2枪" value="port1_to_gun2" />
                        <n-radio-button label="1口6枪" value="port1_to_gun6" />
                        <n-radio-button label="1口8枪" value="port1_to_gun8" />
                        <n-radio-button label="2口2枪" value="port2_to_gun2" />
                        <n-radio-button label="2口4枪" value="port2_to_gun4" />
                        <n-radio-button label="清空" value="clear" />
                    </n-radio-group>
                </n-form-item-gi>

                <n-gi :span="24">
                    <n-divider class="my-0" />
                    <n-card
                        size="small"
                        v-for="(item, index) in machineModel.gunBindingList"
                        :key="index"
                        :title="`油枪信息${index + 1}`"
                        embedded
                        :bordered="false"
                        class="mt-2"
                    >
                        <n-grid>
                            <n-form-item-gi
                                :span="12"
                                :label="`油品${index + 1}`"
                                :path="`gunBindingList[${index}].oilVariety`"
                                :rule="{
                                    required: true,
                                    message: `请选择油品${index + 1}`,
                                    trigger: ['input', 'blur']
                                }"
                            >
                                <n-select
                                    v-model:value="
                                        machineModel.gunBindingList[index]
                                            .oilVariety
                                    "
                                    :options="oilTypeOptions"
                                    clearable
                                    :placeholder="`请选择油品${index + 1}`"
                                />
                            </n-form-item-gi>
                            <n-form-item-gi
                                :span="12"
                                :label="`油枪编号${index + 1}`"
                                :path="`gunBindingList[${index}].gunNo`"
                                :rule="{
                                    required: true,
                                    message: `请输入油枪编号${index + 1}`,
                                    trigger: ['input', 'blur']
                                }"
                            >
                                <n-select
                                    v-model:value="
                                        machineModel.gunBindingList[index].gunNo
                                    "
                                    :options="repeatNum(8)"
                                    clearable
                                    :placeholder="`请选择油枪编号${index + 1}`"
                                />
                            </n-form-item-gi>
                            <n-form-item-gi
                                :span="12"
                                :label="`主板内枪号${index + 1}`"
                                :path="`gunBindingList[${index}].skMapGunNo`"
                                :rule="{
                                    required: true,
                                    message: `请输入主板内枪号${index + 1}`,
                                    trigger: ['input', 'blur']
                                }"
                            >
                                <n-select
                                    v-model:value="
                                        machineModel.gunBindingList[index]
                                            .skMapGunNo
                                    "
                                    :options="repeatNum(8)"
                                    clearable
                                    :placeholder="`请选择主板内枪号${index + 1}`"
                                />
                            </n-form-item-gi>
                            <n-form-item-gi
                                :span="12"
                                :label="`主板通道${index + 1}`"
                                :path="`gunBindingList[${index}].skPortNo`"
                                :rule="{
                                    required: true,
                                    message: `请输入主板通道${index + 1}`,
                                    trigger: ['input', 'blur']
                                }"
                            >
                                <n-select
                                    v-model:value="
                                        machineModel.gunBindingList[index]
                                            .skPortNo
                                    "
                                    :options="repeatNum(8)"
                                    clearable
                                    :placeholder="`请选择主板通道${index + 1}`"
                                />
                            </n-form-item-gi>

                            <n-form-item-gi
                                :span="12"
                                :label="`编码器通道${index + 1}`"
                                :path="`gunBindingList[${index}].pulsePortNo`"
                                :rule="{
                                    required: true,
                                    message: `请选择编码器通道${index + 1}`,
                                    trigger: ['input', 'blur', 'change']
                                }"
                            >
                                <n-select
                                    v-model:value="
                                        machineModel.gunBindingList[index]
                                            .pulsePortNo
                                    "
                                    :options="repeatNum(8)"
                                    clearable
                                    :placeholder="`请选择编码器通道${index + 1}`"
                                />
                            </n-form-item-gi>
                            <n-form-item-gi
                                :span="12"
                                :label="`编码器当量${index + 1}`"
                                :path="`gunBindingList[${index}].pulseCoefficient`"
                                :rule="{
                                    required: true,
                                    type: 'number',
                                    message: `请输入编码器当量${index + 1}`,
                                    trigger: ['input', 'blur', 'change']
                                }"
                            >
                                <n-input-number
                                    v-model:value="
                                        machineModel.gunBindingList[index]
                                            .pulseCoefficient
                                    "
                                    :step="1"
                                    clearable
                                    class="w-100%"
                                />
                            </n-form-item-gi>
                        </n-grid>

                        <template #header-extra>
                            <div class="w-100% flex-center">
                                <n-button
                                    @click="removeDynamicForm(index)"
                                    size="small"
                                    type="error"
                                    quaternary
                                    plain
                                    round
                                >
                                    <icon-ant-design-delete-outlined />
                                </n-button>
                            </div>
                        </template>
                    </n-card>
                </n-gi>
                <!-- <n-form-item-gi :span="24">
          <div class="w-100% flex-center mt-4">
            <n-button @click="createDynamicForm" class="w-80%" dashed type="success"
              :theme-overrides="buttonThemeOverrides">添加</n-button>
          </div>
        </n-form-item-gi> -->
            </n-grid>
        </n-form>

        <template #footer>
            <div class="flex justify-between flex-row-reverse">
                <n-button
                    type="primary"
                    :loading="loading"
                    @click="handleSubmit"
                    >保存</n-button
                >
                <n-button @click="emit('prev')" v-if="props.title"
                    >上一步</n-button
                >
            </div>
        </template>
    </n-card>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ButtonProps, FormInst, FormRules, useMessage } from 'naive-ui'
import { repeat } from 'seemly'
import { useRegisterMachineStore } from '../store'
import { useStationStore } from '@/store'
import { DeviceInfo } from '../types'

// 油枪绑定关系模板
import { gunBindingListTemplate } from '../bind_template'

const store = useRegisterMachineStore()

const props = withDefaults(
    defineProps<{
        title: string
        machineData?: any | null
    }>(),
    {
        title: '',
        machineData: {}
    }
)

function repeatNum(n = 10) {
    return repeat(n, undefined).map((_, i) => ({
        label: String(i + 1),
        value: i.toString()
    }))
}

type ButtonThemeOverrides = NonNullable<ButtonProps>['themeOverrides']

const buttonThemeOverrides: ButtonThemeOverrides = {
    heightMedium: '40px',
    textColor: 'rgba(100, 100, 100, 1)'
}

const factoriesOptions = computed(() => store.machineFactoryOptions)

onMounted(() => {
    if (factoriesOptions && factoriesOptions.value.length === 0) {
        store.getMachineFactoryList()
    }
})

const oilTypeOptions = [
    { label: '92#', value: '92#' },
    { label: '95#', value: '95#' },
    { label: '98#', value: '98#' },
    { label: '0#', value: '0#' },
    { label: '-10#', value: '-10#' }
]

const emit = defineEmits(['prev', 'save', 'close'])

const message = useMessage()

const machineFormRef = ref<FormInst>()

// const bindings = ref([
//   { gunNo: '', skMapGunNo: '', skPortNo: '', oilVariety: '', pulseCoefficient: '', pulsePortNo: '' },
// ])

// const gunNum = computed({
//   get() {
//     return bindings.value.length
//   },
//   set(val) {
//     machineModel.value.gunNum = val
//   }
// })

const machineModel = ref<DeviceInfo>({
    id: 0,
    oldSkDeviceSn: '', //旧加油机编号
    tankerName: '', // 加油机名称
    skDeviceSn: '', // 油站机具编号
    factoryNum: '', // 厂家编号
    factoryName: '', // 厂家名称
    factoryTime: null, // 厂家生产日期
    linkGunOff: '1', // 是否连接编码器
    linkPulse: '1', // 是否连接枪开关
    // mode_type: '无', // 模式选择
    gunNum: 1, // 油枪数量
    gunBindingList: [
        {
            gunNo: '',
            skMapGunNo: '',
            skPortNo: '',
            oilVariety: '',
            pulseCoefficient: 1000,
            pulsePortNo: ''
        }
    ] // 油枪绑定
})
const fuelSite = ref({
    creditCode: '', //社会信用代码
    name: '', //加油站名称
    groupId: '', //油站类别
    telephone: '', //联系电话
    province: '', //省
    city: '', //市
    county: '', //县
    address: '' //详细地址
})

const skDeviceSnOptions = reactive([])

// 油枪绑定关系
const currentGunBinding = ref<string>()

const handleGunBindingChange = (e) => {
    if (e === 'clear') {
        machineModel.value.gunBindingList = []
        machineModel.value.gunNum = machineModel.value.gunBindingList.length

        return
    }
    const temp = gunBindingListTemplate[e]
    machineModel.value.gunBindingList = temp
    machineModel.value.gunNum = temp.length
}

watch(
    () => store.skDeviceSn,
    (val) => {
        if (val) {
            machineModel.value.skDeviceSn = val
        }
    },
    {
        deep: true
    }
)

watch(
    () => props.machineData,
    (val) => {
        // 所属加油站信息
        machineModel.value.tankerName = val.tankerName //加油机名称

        machineModel.value.skDeviceSn = val.skDeviceSn //加油机编号

        machineModel.value.oldSkDeviceSn = val.skDeviceSn //加油机编号
        machineModel.value.id = val.deviceId

        // 获取设备编码下拉数据
        store.getDeviceSnList(null, null).then((data: any) => {
            // 先清空数组
            skDeviceSnOptions.splice(0, skDeviceSnOptions.length)
            // 然后添加新数据
            data.forEach((item) =>
                skDeviceSnOptions.push({
                    label: item.skDeviceSn,
                    value: item.id
                })
            )
        })

        // 根据加油机编号来请求出厂信息
        store.getDeviceInfo(val.skDeviceSn).then((data: any) => {
            machineModel.value.factoryNum = data.factoryNum // 出厂编号
            machineModel.value.factoryName = data.factoryName // 厂家名称
            machineModel.value.factoryTime = data.factoryTime // 出厂日期
            machineModel.value.linkGunOff = data.linkGunOff // 是否连接枪开关
            machineModel.value.linkPulse = data.linkPulse // 是否连接编码器
            machineModel.value.gunNum = data.gunNum // 油枪数量
            if (data.gunBindingList.length > 0) {
                machineModel.value.gunBindingList = data.gunBindingList
            } else {
                machineModel.value.gunBindingList = []
            }
        })

        store.getSiteListId(val.skDeviceSn).then((data: any) => {
            fuelSite.value.creditCode = data.creditCode
            fuelSite.value.name = data.name
            fuelSite.value.groupId = data.groupId
            fuelSite.value.telephone = data.telephone
            fuelSite.value.province = data.province
            fuelSite.value.city = data.city
            fuelSite.value.county = data.county
            fuelSite.value.address = data.address
        })
    },
    {
        deep: true,
        immediate: true
    }
)

const rules: FormRules = {
    skDeviceSn: [
        { required: true, message: '请输入油机编号', trigger: 'blur' }
    ],
    factoryNum: [
        { required: true, message: '请输入出厂编号', trigger: 'blur' }
    ],
    factoryName: [
        { required: true, message: '请输入油机厂家', trigger: 'blur' }
    ],
    factoryTime: [
        { required: true, message: '请选择出厂日期', trigger: 'change' }
    ],
    linkGunOff: [
        { required: true, message: '请选择是否连接编码器', trigger: 'change' }
    ],
    linkPulse: [
        { required: true, message: '请选择是否连接油枪开关', trigger: 'change' }
    ],
    // mode_type: [
    //   { required: true, message: '请选择模式', trigger: 'change' },
    // ],
    gunNum: [
        {
            required: true,
            message: '请输入油枪数量',
            trigger: 'blur',
            type: 'number'
        }
    ]
}

const createDynamicForm = (newValue) => {
    const count = Number(newValue) // 将输入值转换为数字
    if (isNaN(count)) return // 如果转换失败，则不做任何事情
    // 更新 gunBindingList 的长度以匹配输入值
    while (machineModel.value.gunBindingList.length < count) {
        // 如果列表的长度小于输入值，则添加新的空对象
        machineModel.value.gunBindingList.push({
            gunNo: '',
            skMapGunNo: '',
            skPortNo: '',
            oilVariety: '',
            pulseCoefficient: 1000,
            pulsePortNo: ''
        })
    }

    while (machineModel.value.gunBindingList.length > count) {
        // 如果列表的长度大于输入值，则移除末尾的对象
        machineModel.value.gunBindingList.pop()
    }
    // machineModel.value.gunBindingList.push({
    //   gunNo: '',
    //   skMapGunNo: '',
    //   skPortNo: '',
    //   oilVariety: '',
    //   pulseCoefficient: 1000,
    //   pulsePortNo: ''
    // })
}

const removeDynamicForm = (index: number) => {
    // bindings.value.splice(index, 1)
    machineModel.value.gunBindingList.splice(index, 1)
    machineModel.value.gunNum = machineModel.value.gunBindingList.length
}

const loading = ref<boolean>(false)
const stationStore = useStationStore()

// if (props.title) {

// if (registerSkDeviceSn) {
//   machineModel.value = {
//     ...machineModel.value,
//     skDeviceSn: registerSkDeviceSn
//   };
// }
// }

const handleSubmit = () => {
    loading.value = true
    machineFormRef.value?.validate(async (errors) => {
        console.log(
            '%csrc/views/register/components/MachineForm.vue:572 errors',
            'color: #007acc;',
            errors
        )
        if (!errors) {
            if (props.title) {
                const selectedItem = skDeviceSnOptions.find(
                    (option) => option.label == machineModel.value.skDeviceSn
                )
                if (selectedItem) {
                    machineModel.value.id = selectedItem.value
                }

                const factoriesItem = factoriesOptions.value.find(
                    (option) => option.value === machineModel.value.factoryName
                )
                if (factoriesItem) {
                    machineModel.value.factoryName = factoriesItem.label
                }
                const formData = computed(() => stationStore.getFormData)
                fuelSite.value.creditCode = formData.value.creditCode
                fuelSite.value.name = formData.value.name
                fuelSite.value.groupId = formData.value.groupId
                fuelSite.value.telephone = formData.value.telephone
                fuelSite.value.province = formData.value.province
                fuelSite.value.city = formData.value.city
                fuelSite.value.county = formData.value.county
                fuelSite.value.address = formData.value.address
                const machineData = {
                    skDeviceSn: machineModel.value.skDeviceSn,
                    fuelSite: fuelSite.value,
                    deviceInfo: machineModel.value
                }
                await store
                    .firstRegister(machineData)
                    .then((res) => {
                        loading.value = false
                        emit('save', res)
                    })
                    .catch(() => {
                        message.error('保存失败')
                    })
                    .finally(() => {
                        loading.value = false
                        emit('close') // 触发关闭弹窗的事件
                    })
            } else {
                interface RegisterData {
                    fuelSite: object
                    deviceInfo: object
                }

                const selectedItem = skDeviceSnOptions.find(
                    (option) => option.value === machineModel.value.skDeviceSn
                )
                if (selectedItem) {
                    machineModel.value.skDeviceSn = selectedItem.label
                    machineModel.value.id = selectedItem.value
                }
                const factoriesItem = factoriesOptions.value.find(
                    (option) => option.value === machineModel.value.factoryName
                )
                if (factoriesItem) {
                    machineModel.value.factoryName = factoriesItem.label
                }
                const registerData: RegisterData = {
                    fuelSite: fuelSite.value,
                    deviceInfo: machineModel.value
                }
                await store
                    .register(registerData)
                    .then((res) => {
                        loading.value = false
                        emit('save', res)
                    })
                    .catch(() => {
                        message.error('保存失败')
                    })
                    .finally(() => {
                        loading.value = false
                        emit('close') // 触发关闭弹窗的事件
                    })
            }
        } else {
            loading.value = false
            message.error('验证失败')
        }
    })
}
</script>

<style lang="scss">
.n-card {
    .n-card__content {
        height: 5vh;
        overflow: auto;
    }
}
</style>
