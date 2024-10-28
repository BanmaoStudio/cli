<template>
    <n-modal
        v-model:show="modalVisible"
        preset="card"
        :title="title"
        class="w-800px lt-sm:w-400"
        :maskClosable="false"
        @close="closeModal"
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
                <!-- <n-form-item-gi span="0:24 600:12" label="加油站编号" path="siteCode">
          <n-input v-model:value="formModel.siteCode" placeholder="加油站编号" :maxlength="10" :minlength="10" />
        </n-form-item-gi> -->
                <n-form-item-gi span="0:24 600:12" label="联系人" path="legal">
                    <n-input
                        v-model:value="formModel.legal"
                        placeholder="联系人"
                        clearable
                    />
                </n-form-item-gi>
                <n-form-item-gi
                    span="0:24 600:12"
                    label="联系电话"
                    path="telephone"
                >
                    <n-input
                        v-model:value="formModel.telephone"
                        placeholder="联系电话"
                        clearable
                    />
                </n-form-item-gi>
                <n-form-item-gi
                    span="0:24 600:12"
                    label="社会信用代码"
                    path="creditCode"
                >
                    <n-input
                        v-model:value="formModel.creditCode"
                        placeholder="社会信用代码"
                        clearable
                    />
                </n-form-item-gi>
                <n-form-item-gi
                    span="0:24 600:12"
                    label="经营状态"
                    path="state"
                >
                    <n-switch
                        v-model:value="formModel.state"
                        :checked-value="1"
                        :unchecked-value="2"
                    />
                </n-form-item-gi>
                <n-form-item-gi
                    span="0:24 600:12"
                    label="加油机数量"
                    path="machineNum"
                >
                    <n-input-number
                        v-model:value="formModel.machineNum"
                        :min="0"
                        placeholder="加油机数量"
                        clearable
                        class="w-100%"
                    />
                </n-form-item-gi>
                <n-form-item-gi
                    span="0:24 600:12"
                    label="油罐数量"
                    path="tankNum"
                >
                    <n-input-number
                        v-model:value="formModel.tankNum"
                        :min="0"
                        placeholder="油枪数量"
                        clearable
                        class="w-100%"
                    />
                </n-form-item-gi>
                <n-form-item-gi span="24" label="所属地区">
                    <n-cascader
                        v-model:value="areaValue"
                        :options="areaOptions"
                        check-strategy="child"
                        size="medium"
                        clearable
                        @update:value="handleAreaChange"
                    />
                </n-form-item-gi>
                <n-form-item-gi :span="24" label="经营地址" path="address">
                    <n-input
                        type="textarea"
                        v-model:value="formModel.address"
                        placeholder="经营地址"
                        clearable
                    />
                </n-form-item-gi>
            </n-grid>
            <n-space
                class="w-full pt-16px lt-sm:fixed lt-sm:py-10px lt-sm:px-24px lt-sm:left-0 lt-sm:right-0 lt-sm:bottom-0 lt-sm:bg-white lt-sm:shadow-md"
                :size="24"
                justify="end"
            >
                <n-button
                    class="w-72px"
                    strong
                    secondary
                    type="info"
                    @click="handleClose"
                    v-if="props.type === 'add'"
                    >重置</n-button
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
import { useFuelStationStore } from '../store'
import { useDeviceScreen } from '@/hooks'
import { useMessage } from 'naive-ui'
import type { FormInst, FormItemRule, SelectOption } from 'naive-ui'
import type { FuelStationForm } from '../types'
import { areaOptions, loadAllAreaData } from '@/utils/common/areaUtils'
import { fetchCheckName } from '../service'

export interface Props {
    /** 弹窗可见性 */
    visible: boolean
    /**
     * 弹窗类型
     * add: 新增
     * edit: 编辑
     */
    type?: 'add' | 'edit'
    /** 编辑的表格行数据 */
    editData?: any | null
}
const areaValue = ref('')

export type ModalType = NonNullable<Props['type']>

defineOptions({ name: 'StationTableActionModel' })

const commonStore = useCommonStore()
const stationStore = useFuelStationStore()
const message = useMessage()
const { isMobile } = useDeviceScreen()

const labelPlacement = computed(() => {
    return isMobile ? 'top' : 'left'
})

const registerTypeList = computed(() => commonStore.registerTypeList)
// const gasStationTypeOptions = computed(() => commonStore.gasStationTypeList)

function init() {
    if (registerTypeList.value.length <= 0) {
        commonStore.getFactoryList()
    }
    // if (gasStationTypeOptions.value.length <= 0) {
    //   commonStore.getGasStationTypeList()
    // }
}
onMounted(() => {
    init()
})

const title = computed(() => {
    const titles: Record<ModalType, string> = {
        add: '新增加油站',
        edit: '编辑加油站'
    }
    return titles[props.type]
})

const formRef = ref<HTMLElement & FormInst>()

type GasStationFormModel = Omit<FuelStationForm, 'id'>

function createDefaultFormModel(): GasStationFormModel {
    return {
        chemicalsBusinessImg: '',
        dutyPortNum: 0,
        groupId: '',
        oilBusinessImg: '',
        peopleNum: 0,
        name: '',
        creditCode: '',
        legal: '',
        telephone: '',
        state: 1,
        // siteCode: "",
        registerType: '',
        address: '',
        province: undefined,
        city: undefined,
        county: undefined,
        town: undefined,
        startDate: '',
        machineNum: 0,
        tankNum: 0
    }
}

const station_id = ref<number | null>(null)
const formModel = reactive<GasStationFormModel>(createDefaultFormModel())
const findPath = (value, options, currentPath = []) => {
    for (const option of options) {
        const newPath = [...currentPath, option]
        if (option.value === value) {
            return newPath
        } else if (option.children) {
            const result = findPath(value, option.children, newPath)
            if (result) return result
        }
    }
    return null
}
const areaFn = (value) => {
    const fullPath = findPath(value, areaOptions.value)
    if (fullPath && fullPath.length > 0) {
        if (fullPath.length === 1) {
            formModel.province = fullPath[0].value
            formModel.city = ''
            formModel.county = ''
        } else if (fullPath.length === 2) {
            formModel.province = fullPath[0].value
            formModel.city = fullPath[1].value
            formModel.county = ''
        } else if (fullPath.length > 2) {
            formModel.province = fullPath[0].value
            formModel.city = fullPath[1].value
            formModel.county = fullPath[2].value
        }
    }
}

// 检查加油站名称是否重复
function validateFuelStationName(_rule, value) {
    if (!value) {
        return Promise.reject('请填写加油站名称')
    }
    if (props.type === 'edit') {
        return Promise.resolve()
    } else {
        return fetchCheckName(value).then((res) => {
            if (res.status === 0) {
                if (res.data === '1') {
                    return Promise.reject('加油站名称已存在，请输入其他名称')
                } else {
                    return Promise.resolve() // 验证通过
                }
            }
        })
    }
}

// 地区
loadAllAreaData()
const handleAreaChange = (value) => {
    areaFn(value)
}

const props = withDefaults(defineProps<Props>(), {
    type: 'add',
    editData: null
})

interface Emits {
    (e: 'update:visible', visible: boolean): void
    (e: 'update-list'): void
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
function handleClose() {
    const defaultFormModel = createDefaultFormModel()
    handleUpdateFormModel(defaultFormModel)
    areaValue.value = ''
}

const closeModal = () => {
    if (props.type === 'edit') {
        const defaultFormModel = createDefaultFormModel()
        handleUpdateFormModel(defaultFormModel)
        areaValue.value = ''
    }

    modalVisible.value = false
}

function validatorNumberValueType(_rule: FormItemRule, value: number): boolean {
    return !(value == null || undefined)
}

function validatorStationCode(_rule: FormItemRule, value: string) {
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

function validatorCreditCode(_rule: FormItemRule, value: string) {
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
        chemicalsBusinessImg: {},
        dutyPortNum: {},
        groupId: {},
        oilBusinessImg: {},
        peopleNum: {},
        lng: {},
        lat: {},
        name: {
            required: true,
            validator: validateFuelStationName,
            trigger: 'blur'
        },
        creditCode: {
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
        // siteCode: [
        //   {
        //     required: true,
        //     validator: validatorStationCode,
        //     trigger: ["input", "blur "],
        //   },
        // ],
        registerType: {
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
        startDate: {
            required: true,
            message: '请选择开业时间',
            trigger: 'blur'
        },
        machineNum: {
            required: true,
            type: 'number',
            message: '请填写加油机数量',
            trigger: 'blur'
        },
        tankNum: {
            required: true,
            type: 'number',
            message: '请填写油罐数量',
            trigger: 'blur'
        }
    }

const defaultAreaCode = ref<string[]>()

interface AreaOptions {
    province: SelectOption[]
    city: SelectOption[]
    county: SelectOption[]
    town: SelectOption[]
}

// const areaOptions = reactive<AreaOptions>({
//     province: [],
//     city: [],
//     county: [],
//     town: []
// })

/**
 * 获取各级区域列表
 */
// const getAreaList = async (
//   areaCode: number | string,
//   areaOptions: SelectOption[],
// ) => {
//   try {
//     const result = await commonStore.getAreaList(areaCode);
//     if (result.length > 0) {
//       areaOptions.push(
//         ...new Set(
//           result.map((item: AreaCodeItem) => ({
//             label: item.name,
//             value: Number(item.code),
//           })),
//         ),
//       );
//     }
//   } catch (error) {
//     console.error(error);
//   }
// };

/**
 * getProvince异步函数
 */
// const getProvince = async () => {
//   await getAreaList("000000", areaOptions.province);
// };
// // getCity异步函数
// const getCity = async (code: number) => {
//   await getAreaList(code, areaOptions.city);
// };

// // getCounty异步函数
// const getCounty = async (code: number) => {
//   await getAreaList(code, areaOptions.county);
// };

// // getTown异步函数
// const getTown = async (code: number) => {
//   await getAreaList(code, areaOptions.town);
// };

function handleUpdateFormModel(model: Partial<GasStationFormModel>) {
    Object.assign(formModel, model)
}

function handleUpdateFormModelByModalType() {
    const handlers: Record<ModalType, () => void> = {
        add: () => {
            // const defaultFormModel = createDefaultFormModel()
            handleUpdateFormModel(formModel)
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
                if (props.editData?.provinceName) {
                    areaValue.value = props.editData.provinceName
                    if (props.editData.cityName) {
                        areaValue.value += `/${props.editData.cityName}`
                        if (props.editData.countyName) {
                            areaValue.value += `/${props.editData.countyName}`
                        }
                    }
                }

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

            if (props.type === 'edit') {
                const result = await stationStore.saveData({
                    ...formModel,
                    id: props.editData?.id
                    // peopleNum: 0,
                    // startDate: "",
                    // siteCode: "",
                    // groupId: "",
                    // oilBusinessImg: "",
                    // chemicalsBusinessImg: "",
                    // state: 0,
                    // name: "",
                    // legal: "",
                    // telephone: "",
                    // address: "",
                    // creditCode: "",
                    // dutyPortNum: 0,
                    // machineNum: 0,
                    // tankNum: 0
                })
                if (result) {
                    emit('update-list')
                    const defaultFormModel = createDefaultFormModel()
                    handleUpdateFormModel(defaultFormModel)
                    areaValue.value = ''
                    closeModal()
                }
            } else {
                const result = await stationStore.saveData({
                    ...formModel
                    // peopleNum: 0,
                    // startDate: "",
                    // siteCode: "",
                    // groupId: "",
                    // oilBusinessImg: "",
                    // chemicalsBusinessImg: "",
                    // state: 0,
                    // name: "",
                    // legal: "",
                    // telephone: "",
                    // address: "",
                    // creditCode: "",
                    // dutyPortNum: 0,
                    // machineNum: 0,
                    // tankNum: 0
                })
                if (result) {
                    emit('update-list')
                    const defaultFormModel = createDefaultFormModel()
                    handleUpdateFormModel(defaultFormModel)
                    areaValue.value = ''
                    closeModal()
                }
            }
        } else {
            console.log(errors)
            message.error('验证失败')
        }
    })
}

watch(
    () => props.visible,
    (newValue) => {
        if (newValue) {
            handleUpdateFormModelByModalType()
            // getProvince();
            // if (props.type === "edit") {
            //   getCity(formModel.province as unknown as number);
            //   getCounty(formModel.city as unknown as number);
            //   getTown(formModel.county as unknown as number);
            // }
        }
    }
)
</script>
