<template>
    <div
        ref="tabRef"
        class="h-full"
        :class="[isChromeMode ? 'flex items-end' : 'flex-y-center']"
    >
        <PageTab
            :mode="mode"
            v-for="(item, index) in tab.tabs"
            :key="item.fullPath"
            :active="tab.activeTab === item.fullPath"
            :dark-mode="theme.darkMode"
            :active-color="theme.themeColor"
            :closable="!(item.name === tab.homeTab.name || item.meta.affix)"
            :class="{
                '!mr-0': isChromeMode && index === tab.tabs.length - 1,
                'mr-10px': !isChromeMode
            }"
            @click="tab.handleClickTab(item.fullPath)"
            @close="tab.removeTab(item.fullPath)"
            @contextmenu="
                handleContextMenu($event, item.fullPath, item.meta.affix)
            "
        >
            <!-- <svg-icon
        :icon="item.meta.icon"
        :local-icon="item.meta.localIcon"
        class="inline-block align-text-bottom mr-4px text-16px"
      /> -->
            {{ item.meta.title }}
        </PageTab>
    </div>
    <context-menu
        :visible="dropdown.visible"
        :current-path="dropdown.currentPath"
        :affix="dropdown.affix"
        :x="dropdown.x"
        :y="dropdown.y"
        @update:visible="handleDropdownVisible"
    />
</template>

<script setup lang="ts">
import { computed, nextTick, reactive, ref, watch } from 'vue'
import { PageTab } from '@soybeanjs/vue-materials'
import { useTabStore, useThemeStore } from '@/store'
import { ContextMenu } from './components'

import '@soybeanjs/vue-materials/dist/style.css'

defineOptions({ name: 'TabDetail' })

interface Emits {
    (e: 'scroll', clientX: number): void
}

const emit = defineEmits<Emits>()

const theme = useThemeStore()
const tab = useTabStore()

const mode = computed(() => theme.tab.mode)
const isChromeMode = computed(() => mode.value === 'chrome')

// 获取当前激活的tab的clientX
const tabRef = ref<HTMLElement>()
async function getActiveTabClientX() {
    await nextTick()
    if (
        tabRef.value &&
        tabRef.value.children.length &&
        tabRef.value.children[tab.activeTabIndex]
    ) {
        const activeTabElement = tabRef.value.children[tab.activeTabIndex]
        const { x, width } = activeTabElement.getBoundingClientRect()
        const clientX = x + width / 2
        setTimeout(() => {
            emit('scroll', clientX)
        }, 50)
    }
}

interface DropdownConfig {
    visible: boolean
    affix: boolean
    x: number
    y: number
    currentPath: string
}

const dropdown: DropdownConfig = reactive({
    visible: false,
    affix: false,
    x: 0,
    y: 0,
    currentPath: ''
})

function setDropdown(config: Partial<DropdownConfig>) {
    Object.assign(dropdown, config)
}

let isClickContextMenu = false

function handleDropdownVisible(visible: boolean) {
    if (!isClickContextMenu) {
        setDropdown({ visible })
    }
}

/** 点击右键菜单 */
async function handleContextMenu(
    e: MouseEvent,
    currentPath: string,
    affix?: boolean
) {
    e.preventDefault()

    const { clientX, clientY } = e

    isClickContextMenu = true

    const DURATION = dropdown.visible ? 150 : 0

    setDropdown({ visible: false })

    setTimeout(() => {
        setDropdown({
            visible: true,
            x: clientX,
            y: clientY,
            currentPath,
            affix
        })
        isClickContextMenu = false
    }, DURATION)
}

watch(
    () => tab.activeTabIndex,
    () => {
        getActiveTabClientX()
    },
    {
        immediate: true
    }
)
</script>

<style scoped></style>
