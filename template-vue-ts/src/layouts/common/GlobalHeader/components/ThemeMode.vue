<template>
    <n-tooltip trigger="hover">
        <template #trigger>
            <n-button
                type="default"
                circle
                quaternary
                size="small"
                class="text-18px color-#333"
                @click="handleSwitch"
            >
                <icon-mdi-moon-waning-crescent v-if="darkMode" />
                <icon-mdi-white-balance-sunny v-else />
            </n-button>
        </template>
        主题模式
    </n-tooltip>
</template>

<script setup lang="ts">
import { useThemeStore } from '@/store'

defineOptions({ name: 'ThemeMode' })

const theme = useThemeStore()

const darkMode = computed(() => theme.darkMode)

const handleSwitch = () => {
    theme.toggleDarkMode()
}
</script>
