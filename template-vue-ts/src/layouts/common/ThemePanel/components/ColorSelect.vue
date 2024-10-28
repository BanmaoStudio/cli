<template>
    <div class="flex gap-4 flex-wrap">
        <ColorSelectItem
            v-for="(color, index) in theme.themeColorList"
            :key="index"
            :color="color.value"
            :selected="color.value === value"
            @click="handleSelect(color.value)"
        />
    </div>
</template>

<script lang="ts" setup>
import { useThemeStore } from '@/store'
import ColorSelectItem from './ColorSelectItem.vue'

const value = defineModel('value')

const theme = useThemeStore()

const handleSelect = (color: string) => {
    console.log(color)
    value.value = color
}
</script>
