<template>
    <div>
        <span
            class="status-dot"
            :style="{ backgroundColor: props.color }"
        ></span>
        {{ props.text }}
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    color: {
        type: String,
        default: ''
    },
    text: {
        type: String,
        default: ''
    }
})
</script>
<style scoped>
.status-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 5px;
}
</style>
