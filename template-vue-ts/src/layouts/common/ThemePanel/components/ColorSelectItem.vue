<template>
    <div
        class="flex-center w-30px h-30px b-1 cursor-pointer rounded"
        :style="style"
    >
        <icon-hugeicons-tick-02
            v-show="selected"
            class="text-18px font-bold text-white"
        />
    </div>
</template>

<script lang="ts" setup>
export interface ColorSelectItemProps {
    color: string
    selected: boolean
}

const { color, selected = false } = defineProps<ColorSelectItemProps>()

const style = computed(() => ({
    background: color
}))

// const emit = defineEmits(['click'])

// const handleClick = () => {
//   console.log('click')
// }
</script>
