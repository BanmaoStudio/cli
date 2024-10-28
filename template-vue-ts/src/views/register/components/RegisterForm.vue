<template>
    <n-card class="shadow hover:shadow-xl">
        <template #header>
            <div class="flex-center">首次注册监控数据采集装置</div>
        </template>
        <n-form
            ref="formRef"
            :model="model"
            :rules="rules"
            label-placement="left"
            label-width="auto"
            :show-require-mark="false"
            require-mark-placement="right-hanging"
            size="large"
        >
            <n-form-item label="序列号" path="skDeviceSn">
                <!-- <n-input
          v-model:value="model.skDeviceSn"
          placeholder="序列号"
          maxlength="24"
          clearable
        /> -->
                <n-select
                    v-model:value="model.skDeviceSn"
                    filterable
                    placeholder="请输入序列号"
                    :options="skDeviceSnOptions"
                    :render-label="renderLabel"
                    clearable
                />
            </n-form-item>
            <div class="flex justify-center">
                <n-button
                    type="primary"
                    :disabled="disabled"
                    :loading="loading"
                    @click="handleSubmit"
                    >首次注册</n-button
                >
            </div>
        </n-form>
    </n-card>
</template>

<script setup lang="tsx">
import { ref } from 'vue'
import { FormInst, FormItemRule, useMessage } from 'naive-ui'
import { useRegisterMachineStore } from '../store'
import { useStationStore } from '@/store'

const store = useRegisterMachineStore()

const emit = defineEmits(['submit'])

const message = useMessage()
const formRef = ref<FormInst>()
const loading = ref<boolean>(false)

const disabled = ref<boolean>(true)

const model = ref({
    skDeviceSn: ''
})

const rules = {
    skDeviceSn: [
        {
            required: true,
            validator(rule: FormItemRule, value: string) {
                const selectedItem = skDeviceSnOptions.find(
                    (option) => option.value === value
                )
                if (!value) {
                    return new Error('请输入采集装置编号')
                } else if (selectedItem.label.length !== 24) {
                    return new Error('采集装置编号长度为24')
                } else {
                    disabled.value = false
                }
                return true
            },
            trigger: ['change', 'input']
        }
    ]
}
const stationStore = useStationStore()

const skDeviceSnOptions = reactive([])
//  // 获取设备编码下拉数据
store.getDeviceSnList(null, null).then((data) => {
    // 先清空数组
    skDeviceSnOptions.splice(0, skDeviceSnOptions.length)
    // 然后添加新数据
    data.forEach((item) =>
        skDeviceSnOptions.push({
            label: item.skDeviceSn,
            value: item.id,
            status: item.status,
            onlineStatus: item.onlineStatus
        })
    )
})
const renderLabel = (option: SelectOption): VNodeChild => {
    // // 当状态为 '0' 时，显示“未注册”的标签
    // const tag = option.status === '0' ? h(NTag, { type: 'info' }, { default: () => '未注册' }) : '';

    // // 返回含有条件渲染的 <n-tag>（如果有）和选项标签的组合
    // return [tag, option.label];
    if (!option.value) {
        return
    }
    return (
        <n-space>
            <span>{option.label}</span>
            <n-tag
                size="small"
                type={
                    option.status === 0
                        ? 'success'
                        : option.status === 1
                          ? 'info'
                          : ''
                }
            >
                {option.status === 0
                    ? '未注册'
                    : option.status === 1
                      ? '注册中'
                      : '已注册'}
            </n-tag>
            <n-tag
                size="small"
                type={option.onlineStatus === 1 ? 'success' : 'error'}
            >
                {option.onlineStatus === 1 ? '在线' : '离线'}
            </n-tag>
        </n-space>
    )
}
const handleSubmit = (e: MouseEvent) => {
    e.preventDefault()
    loading.value = true
    const selectedItem: any = skDeviceSnOptions.find(
        (option) => option.value === model.value.skDeviceSn
    )
    stationStore.setSkDeviceSn(selectedItem.label)
    formRef.value?.validate(async (errors) => {
        if (!errors) {
            // 验证通过，执行提交逻辑
            const selectedItem = skDeviceSnOptions.find(
                (option) => option.value === model.value.skDeviceSn
            )
            store.isFirstType('1')
            // store.setSkDeviceSN(model.value.skDeviceSn);
            store.setSkDeviceSN(selectedItem.label)

            try {
                const result = await store.getIsRegistered(selectedItem.label)
                if (result === 'ok') {
                    emit('submit')
                } else {
                    message.error(result)
                }
                loading.value = false
            } catch (error) {
                throw new Error(error as string)
            } finally {
                loading.value = false
            }
        } else {
            message.error('验证失败，请检查表单')
        }
    })
}
</script>
