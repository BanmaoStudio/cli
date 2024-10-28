<template>
  <n-select :options="options" v-model:value="model" @update:value="handleChange" />

</template>

<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import { ref } from 'vue'

const model = defineModel<string>('value')
const emit = defineEmits(['change:modelValue'])

const handleChange = (e) => {
  emit('change:modelValue', e)
}

const options = ref<SelectOption[]>()

</script>
