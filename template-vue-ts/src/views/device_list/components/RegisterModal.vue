<template>
    <n-modal
        v-modal:show="modalVisible"
        preset="card"
        title="注册加油机"
        class="w-800px"
    >
        <machine-form @save="handleSubmit" />
    </n-modal>
</template>

<script setup lang="ts">
import MachineForm from '@/views/register/components/MachineForm.vue'

interface Props {
    visible: boolean
}

const props = defineProps<Props>()

const emit = defineEmits(['update:visible'])

const modalVisible = computed({
    get() {
        return props.visible
    },
    set(visible) {
        emit('update:visible', visible)
    }
})

const resultData = ref({
    stationName: '',
    sk4gFirmwareVer: '',
    sk4gImei: '',
    sk4gSignalIntensity: '',
    skMcuFirmwareVer: '',
    skSimCcid: ''
})
const handleSubmit = (data: any) => {
    resultData.value = data
}
</script>
