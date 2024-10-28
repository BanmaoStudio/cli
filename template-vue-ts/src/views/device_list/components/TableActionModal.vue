<template>
    <n-modal
        v-model:show="modalVisible"
        preset="card"
        :title="title"
        class="w-800px lt-sm:w-400"
    >
        <n-form
            ref="formRef"
            :label-placement="labelPlacement"
            :label-width="120"
            :model="formModel"
            :rules="rules"
            :show-require-mark="false"
        >
            <n-grid
                :cols="24"
                :x-gap="18"
                item-responsive
                class="lt-sm:mb-16px"
            >
                <n-form-item-gi :span="24" label="加油站名称" path="name">
                    <n-input
                        v-model:value="formModel.name"
                        placeholder="加油站名称"
                    />
                </n-form-item-gi>
                <n-form-item-gi
                    span="0:24 600:12"
                    label="加油站编号"
                    path="station_code"
                >
                    <n-input
                        v-model:value="formModel.station_code"
                        placeholder="加油站编号"
                        :maxlength="10"
                        :minlength="10"
                    />
                </n-form-item-gi>
                <n-form-item-gi
                    span="0:24 600:12"
                    label="加油机数量"
                    path="machine_num"
                >
                    <n-input-number
                        v-model:value="formModel.machine_num"
                        :min="0"
                        placeholder="加油机数量"
                        clearable
                        class="w-100%"
                    />
                </n-form-item-gi>
                <n-form-item-gi
                    span="0:24 600:12"
                    label="油枪数量"
                    path="gun_num"
                >
                    <n-input-number
                        v-model:value="formModel.gun_num"
                        :min="0"
                        placeholder="油枪数量"
                        clearable
                        class="w-100%"
                    />
                </n-form-item-gi>
            </n-grid>
            <n-space
                class="w-full pt-16px lt-sm:fixed lt-sm:py-10px lt-sm:px-24px lt-sm:left-0 lt-sm:right-0 lt-sm:bottom-0 lt-sm:bg-white lt-sm:shadow-md"
                :size="24"
                justify="end"
            >
                <n-button class="w-72px" @click="closeModal">取消</n-button>
                <n-button class="w-72px" type="primary" @click="handleSubmit"
                    >确定</n-button
                >
            </n-space>
        </n-form>
    </n-modal>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted } from 'vue'
import { useCommonStore } from '@/store'
import { useStationStore } from '../store'
import { useDeviceScreen } from '@/hooks'

import type { FormInst, FormItemRule, SelectOption } from 'naive-ui'
import type { DeviceForm } from '../types'
import type { AreaCodeItem } from '@/services/common/types'

export interface Props {
    /** 弹窗可见性 */
    visible: boolean
    /**
     * 弹窗类型
     * add: 新增
     * edit: 修改
     */
    type?: 'add' | 'edit'
    /** 编辑的表格行数据 */
    editData?: any | null
}

export type ModalType = NonNullable<Props['type']>

defineOptions({ name: 'StationTableActionModel' })

const commonStore = useCommonStore()
const stationStore = useStationStore()
const message = useMessage()
const { isMobile } = useDeviceScreen()

const labelPlacement = computed(() => {
    return isMobile ? 'top' : 'left'
})

const registerTypeList = computed(() => commonStore.registerTypeList)
// const gasStationTypeOptions = computed(() => commonStore.gasStationTypeList)

function init() {
    if (registerTypeList.value.length <= 0) {
        commonStore.getRegisterTypeList()
    }
    // if (gasStationTypeOptions.value.length <= 0) {
    //   commonStore.getGasStationTypeList()
    // }
}
onMounted(() => {
    init()
})

const props = withDefaults(defineProps<Props>(), {
    type: 'add',
    editData: null
})

interface Emits {
    (e: 'update:visible', visible: boolean): void
}

const emit = defineEmits<Emits>()

const modalVisible = computed({
    get() {
        return props.visible
    },
    set(visible) {
        emit('update:visible', visible)
    }
})

const closeModal = () => {
    modalVisible.value = false
}

const title = computed(() => {
    const titles: Record<ModalType, string> = {
        add: '添加加油站',
        edit: '修改加油站'
    }
    return titles[props.type]
})

const formRef = ref<HTMLElement & FormInst>()

type GasStationFormModel = Omit<DeviceForm, 'id'>

function createDefaultFormModel(): GasStationFormModel {
    return {
        name: '',
        credit_code: '',
        legal: '',
        telephone: '',
        state: 1,
        station_code: '',
        register_type: null,
        address: '',
        province: null,
        city: null,
        county: null,
        town: null,
        start_date: null,
        machine_num: 0,
        gun_num: 0,
        tank_num: 0,
        receiver: '',
        receiver_phone: ''
    }
}

const station_id = ref<number | null>(null)
const formModel = reactive<GasStationFormModel>(createDefaultFormModel())

function validatorNumberValueType(rule: FormItemRule, value: number): boolean {
    return value === null || undefined ? false : true
}

function validatorStationCode(rule: FormItemRule, value: string) {
    const regRex = /^[1-9]\d{5}\d{3}/
    if (!value) {
        return new Error('请填写加油站编号')
    } else if (!regRex.test(value)) {
        return new Error('加油站编号格式不正确')
    } else if (value.length !== 9) {
        return new Error('加油站编号长度应为9位')
    } else {
        return true
    }
}

function validatorCreditCode(rule: FormItemRule, value: string) {
    const regRex =
        /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/
    if (!value) {
        return new Error('请填写社会信用代码')
    } else if (!regRex.test(value)) {
        return new Error('社会信用代码格式不正确')
    } else if (value.length !== 18) {
        return new Error('社会信用代码长度应为18位')
    } else {
        return true
    }
}

const rules: Record<keyof GasStationFormModel, FormItemRule | FormItemRule[]> =
    {
        name: { required: true, message: '请填写加油站名称', trigger: 'blur' },
        credit_code: {
            required: true,
            validator: validatorCreditCode,
            trigger: ['input', 'change']
        },
        legal: {
            required: true,
            message: '请填写法人代表名称',
            trigger: 'blur'
        },
        telephone: {
            required: true,
            message: '请填写联系电话',
            trigger: 'blur'
        },
        state: {
            required: true,
            validator: validatorNumberValueType,
            message: '请选择加油站运营状态',
            trigger: ['blur', 'change']
        },
        station_code: [
            {
                required: true,
                validator: validatorStationCode,
                trigger: ['input', 'blur ']
            }
        ],
        register_type: {
            required: true,
            message: '请选择注册类型',
            trigger: 'blur'
        },
        address: {
            required: true,
            message: '请填写加油站地址',
            trigger: 'blur'
        },
        province: {
            required: true,
            message: '请选择所属省份',
            type: 'number',
            trigger: 'blur'
        },
        city: {
            required: true,
            message: '请选择所属城市',
            type: 'number',
            trigger: 'blur'
        },
        county: {
            required: true,
            message: '请选择所属区县',
            type: 'number',
            trigger: 'blur'
        },
        town: {
            required: true,
            message: '请选择所属乡镇/街道',
            type: 'number',
            trigger: 'blur'
        },
        start_date: {
            required: true,
            message: '请选择开业时间',
            trigger: 'blur'
        },
        machine_num: {
            required: true,
            type: 'number',
            message: '请填写加油机数量',
            trigger: 'blur'
        },
        gun_num: {
            required: true,
            type: 'number',
            message: '请填写油枪数量',
            trigger: 'blur'
        },
        tank_num: {
            required: true,
            type: 'number',
            message: '请填写油罐数量',
            trigger: 'blur'
        },
        receiver: { message: '请填写短信接收人', trigger: 'blur' },
        receiver_phone: { message: '请填写接收手机号', trigger: 'blur' }
    }

// const defaultAreaCode = ref<string[]>()

interface AreaOptions {
    province: SelectOption[]
    city: SelectOption[]
    county: SelectOption[]
    town: SelectOption[]
}

const areaOptions = reactive<AreaOptions>({
    province: [],
    city: [],
    county: [],
    town: []
})

/**
 * 获取各级区域列表
 */
const getAreaList = async (
    areaCode: number | string,
    areaOptions: SelectOption[]
) => {
    try {
        const result = await commonStore.getAreaList(areaCode)
        if (result.length > 0) {
            areaOptions.push(
                ...new Set(
                    result.map((item: AreaCodeItem) => ({
                        label: item.name,
                        value: Number(item.code)
                    }))
                )
            )
        }
    } catch (error) {
        console.error(error)
    }
}

/**
 * getProvince异步函数
 */
const getProvince = async () => {
    await getAreaList('000000', areaOptions.province)
}
// getCity异步函数
const getCity = async (code: number) => {
    await getAreaList(code, areaOptions.city)
}

// getCounty异步函数
const getCounty = async (code: number) => {
    await getAreaList(code, areaOptions.county)
}

// getTown异步函数
const getTown = async (code: number) => {
    await getAreaList(code, areaOptions.town)
}

function handleUpdateFormModel(model: Partial<GasStationFormModel>) {
    Object.assign(formModel, model)
}

function handleUpdateFormModelByModalType() {
    const handlers: Record<ModalType, () => void> = {
        add: () => {
            const defaultFormModel = createDefaultFormModel()
            handleUpdateFormModel(defaultFormModel)
        },
        edit: () => {
            if (props.editData) {
                const { id, ...editData } = props.editData
                // const area = town || county || city || province
                // defaultAreaCode.province = province
                // defaultAreaCode.city = city
                // defaultAreaCode.county = county
                // defaultAreaCode.town = town;
                // defaultAreaCode.value = [province, city, county, town]
                station_id.value = id
                handleUpdateFormModel({
                    ...editData
                    // start_data: dayjs(start_date).valueOf()
                })
            }
        }
    }

    handlers[props.type]()
}

function handleSubmit() {
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            // message.success('新增成功!')
            // const { start_date, ...otherFormModel } = formModel;

            if (props.type === 'add') {
                const result = await stationStore.addData(formModel)
            } else if (props.type === 'edit') {
                const result = await stationStore.editData({
                    id: 0,
                    tankerName: '',
                    siteName: undefined
                })
            }
            await closeModal()
        } else {
            console.log(errors)
            message.error('验证失败')
        }
    })
}

// onMounted(() => {
//   getProvince()
// })

watch(
    () => props.visible,
    (newValue) => {
        if (newValue) {
            handleUpdateFormModelByModalType()
            getProvince()
            if (props.type === 'edit') {
                getCity(formModel.province as unknown as number)
                getCounty(formModel.city as unknown as number)
                getTown(formModel.county as unknown as number)
            }
        }
    }
)
</script>
