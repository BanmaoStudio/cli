<template>
    <n-card class="shadow hover:shadow-xl">
        <template #header>
            <n-h2 class="mb-0 text-center">油站信息</n-h2>
        </template>

        <n-form
            ref="stationFormRef"
            :model="stationModel"
            :rules="rules"
            label-placement="top"
            label-width="140px"
            require-mark-placement="right-hanging"
        >
            <n-grid>
                <n-form-item-gi :span="24" label="加油站名称" path="name">
                    <!-- <n-input
                        v-model:value="stationModel.name"
                        placeholder="请输入加油站名称"
                        clearable
                    /> -->
                    <n-select
                        v-model:value="stationModel.name"
                        :options="stationOptions"
                        @update:value="getStationInfo"
                        placeholder="请选择加油站名称"
                        clearable
                        filterable
                    />
                </n-form-item-gi>
                <n-form-item-gi
                    :span="24"
                    label="社会信用代码"
                    path="creditCode"
                >
                    <n-input
                        v-model:value="stationModel.creditCode"
                        placeholder="请输入社会信用代码"
                        clearable
                    />
                </n-form-item-gi>
                <n-form-item-gi :span="24" label="油站类别" path="groupId">
                    <n-select
                        v-model:value="stationModel.groupId"
                        :options="stationGroupOptions"
                        clearable
                        placeholder="请选择油站类别"
                    />
                </n-form-item-gi>
                <n-form-item-gi :span="24" label="所属区域" path="areaCode">
                    <n-cascader
                        :default-value="areaCode"
                        v-model:value="stationModel.areaCode"
                        placeholder="请选择所属区域"
                        expand-trigger="click"
                        check-strategy="child"
                        :options="areaOptions"
                        :filterable="true"
                        value-field="code"
                        label-field="name"
                        clearable
                        @update:value="handleAreaCodeChange"
                    />
                </n-form-item-gi>
                <!-- <n-grid :cols="3" :x-gap="24">
            <n-form-item-gi path="province" :show-label="false">
              <n-select v-model:value="stationModel.province" :options="provinceOptions" clearable placeholder="请选择省份"
                :consistent-menu-width="false"
                @update:value="handleProvinceChange"
              />
            </n-form-item-gi>
            <n-form-item-gi path="city" :show-label="false">
              <n-select v-model:value="stationModel.city" :options="areaCode.cityOptions" clearable placeholder="请选择城市"
                :consistent-menu-width="false" />
            </n-form-item-gi>
            <n-form-item-gi path="county" :show-label="false">
              <n-select v-model:value="stationModel.county" :options="areaCode.countyOptions" clearable placeholder="请选择区县"
                        :consistent-menu-width="false" />
            </n-form-item-gi>
            <n-form-item-gi path="town" :show-label="false">
              <n-select v-model:value="stationModel.town" :options="areaCode.townOptions" clearable placeholder="请选择街道\乡镇"
                :consistent-menu-width="false" />
            </n-form-item-gi>
      </n-grid>  -->
                <n-form-item-gi
                    :span="24"
                    label="油站联系电话"
                    path="telephone"
                >
                    <n-input
                        v-model:value="stationModel.telephone"
                        placeholder="请输入油站联系电话"
                        clearable
                        :allow-input="onlyAllowTelephoneAndMobile"
                    />
                </n-form-item-gi>
                <n-form-item-gi :span="24" label="油站地址" path="address">
                    <n-input
                        type="textarea"
                        v-model:value="stationModel.address"
                        placeholder="请输入油站地址"
                        clearable
                    />
                </n-form-item-gi>
                <!-- <n-form-item-gi :span="24" label="油站位置" path="coordinate">
          <n-input v-model:value="stationModel.coordinate" placeholder="请输入油站位置" clearable
            :allow-input="onlyAllowCoordinate"
          />
        </n-form-item-gi> -->
            </n-grid>
        </n-form>

        <template #footer>
            <div class="flex justify-between flex-row-reverse">
                <n-button
                    type="primary"
                    @click="handleStep2MachineInfo"
                    :theme-overrides="{
                        colorHoverPrimary: '#5200cc'
                    }"
                    >下一步</n-button
                >
                <n-button @click="handlePrev">上一步</n-button>
            </div>
        </template>
    </n-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
    CascaderOption,
    FormInst,
    FormItemRule,
    FormRules,
    useMessage
} from 'naive-ui'
import { useAreaCode } from '@/hooks/useAreaCode'
import { StationInfoFormData } from '../types'
import { useRegisterMachineStore } from '../store'
import { useCommonStore, useStationStore } from '@/store'
import { AreaCodeItem } from '@/services/common/types'

const store = useRegisterMachineStore()
const commonStore = useCommonStore()

const emit = defineEmits(['prev', 'next'])

const message = useMessage()

const stationFormRef = ref<FormInst>()

// 获取加油站列表
const stationOptions = computed(() => commonStore.fuelStationList)

onMounted(() => {
    if (stationOptions && stationOptions.value.length === 0) {
        commonStore.getFuelStationList()
    }
})

// 获取加油站类别
const stationGroupOptions = computed(() => store.stationGroupOptions)

onMounted(() => {
    if (stationGroupOptions && stationGroupOptions.value.length === 0) {
        store.getFuelStationTypeList()
    }
})

// 获取加油站所在地区
// const { areaCodeList: provinceOptions } = useAreaCode();
const { allAreaCodeList: areaOptions } = useAreaCode('', 'all')

const areaCode = ref<string[]>()
const defaultAreaCode = ref<string[]>()

const stationModel = ref<StationInfoFormData>({
    name: '', // 油站名称
    creditCode: '', // 纳税人识别号
    groupId: 1, // 油站类别
    areaCode: '', // 油站区域编码
    province: '', // 省份
    city: '', // 城市
    county: '', // 县区
    town: '', // 乡镇
    telephone: '', // 油站联系电话
    // coordinate: '', // 坐标
    address: '' // 油站地址
})

function init() {
    const { province, city, county, lng, lat, ...stationData } =
        store.formData.fuelSite

    areaCode.value = [province, city, county]
    stationModel.value = {
        ...stationData,
        areaCode: county,
        coordinate: `${lng},${lat}`
    }
}

init()

watch(
    () => store.formData.fuelSite,
    (val) => {
        const { province, city, county, lng, lat, ...stationData } = val

        stationModel.value = {
            ...stationData,
            areaCode: county.toString(),
            coordinate: `${lng},${lat}`
        }
    },
    {
        deep: true,
        immediate: true
    }
)

const rules: FormRules = {
    name: [
        { required: true, message: '请输入油站名称', trigger: 'blur' },
        {
            validator: (_, value: string) => {
                if (value !== value.trim()) {
                    return new Error('油站名称前后不能有空格')
                }
                return true
            },
            trigger: 'blur'
        }
    ],
    creditCode: [
        { required: true, message: '请输入社会信用代码', trigger: 'blur' },
        {
            validator: (_, value: string) => {
                if (value !== value.trim()) {
                    return new Error('社会信用代码前后不能有空格')
                }
                return true
            },
            trigger: 'blur'
        }
    ],
    // groupId: [
    //     {
    //         required: true,
    //         message: '请选择油站类别',
    //         trigger: 'blur',
    //         type: 'number'
    //     }
    // ],
    areaCode: [
        { required: true, message: '请选择油站区域编码', trigger: 'blur' }
    ],
    telephone: [
        {
            // required: true,
            validator: (_: FormItemRule, value: string) => {
                if (!value) {
                    return true
                } else if (!/^1[3-9]\d{9}$/.test(value)) {
                    return new Error('手机号码格式不正确')
                } else if (value !== value.trim()) {
                    return new Error('手机号码前后不能有空格')
                }
                return true
            },
            trigger: ['blur', 'input']
        }
    ]
    // address: [
    //     { required: true, message: '请输入油站地址', trigger: 'blur' },
    //     {
    //         validator: (_, value: string) => {
    //             if (value !== value.trim()) {
    //                 return new Error('油站地址前后不能有空格')
    //             }
    //             return true
    //         },
    //         trigger: 'blur'
    //     }
    // ]
    // coordinate: [{ required: true, message: '请输入坐标', trigger: 'blur' }]
}

const onlyAllowTelephoneAndMobile = (value: string) =>
    !value || /[0-9-]+$/.test(value)
// const onlyAllowCoordinate = (value: string) => !value || /[0-9.,]+$/.test(value)

const handlePrev = () => {
    emit('prev')
}

const handleAreaCodeChange = (
    e: string | number | Array<string | number> | null,
    option: CascaderOption | Array<CascaderOption | null> | null,
    pathValues:
        | Array<CascaderOption | null>
        | Array<CascaderOption[] | null>
        | null
) => {
    // console.log('%cStationForm.vue line:157 e', 'color: #007acc;', e)
    const values: string[] = []
    Array.isArray(pathValues) &&
        pathValues.forEach((item: any) => {
            values.push(item.code)
        })
    areaCode.value = values
    stationModel.value.areaCode = e as string
}

const handleMachineData = () => {
    if (store.formData.isFirst === '0') {
        store.getMachineFormDataByRemote({
            deviceSn: store.formData.oldSkDeviceSn
        })
    }
}
const stationStore = useStationStore()
const handleStep2MachineInfo = () => {
    stationFormRef.value?.validate((errors) => {
        if (!errors) {
            // const { coordinate, ...formData } = stationModel.value;
            // const [longitude, latitude] = coordinate.split(',')

            let province = '',
                city = '',
                county = ''
            if (areaCode.value && areaCode.value.length === 3) {
                province = areaCode.value[0]
                city = areaCode.value[1]
                county = areaCode.value[2]
            }

            // const formDataWithCoordinate = { ...formData, province, city, county, lng: longitude, lat: latitude }
            const formDataWithCoordinate = {
                ...stationModel.value,
                province,
                city,
                county
            }

            // 使用 Pinia store
            stationStore.setFormData(formDataWithCoordinate)
            store.setStationFormData(formDataWithCoordinate)

            handleMachineData()

            emit('next')
        } else {
            message.error('验证失败')
        }
    })
}

const getStationInfo = async (e) => {
    const { province, city, county, ...data } = await store.getSiteInfoById(
        e.toString()
    )
    areaCode.value = [province + '', city + '', county + '']
    stationModel.value = {
        ...stationModel.value,
        ...data,
        areaCode: county && county.toString()
    }
}
</script>
