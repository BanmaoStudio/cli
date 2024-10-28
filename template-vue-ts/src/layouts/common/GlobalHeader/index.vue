<template>
    <n-layout-header
        class="flex justify-between px-16px shadow-md"
        :style="{ height: theme.header.height + 'px' }"
    >
        <div class="flex flex-y-center">
            <global-logo
                class="lt-sm:flex hidden cursor-pointer"
                @click="activate"
                :show-title="showTitle"
                :style="{ height: theme.header.height + 'px' }"
            />
            <global-logo
                class="lt-sm:hidden"
                :show-title="showTitle"
                :style="{ height: theme.header.height + 'px' }"
            />
            <div class="absolute lt-sm:hidden" :style="{ left }">
                <slot name="breadcrumb"></slot>
            </div>
        </div>
        <div
            class="lt-sm:hidden flex-y-center justify-end h-full padding-16px border-box"
        >
            <n-space justify="space-between" align="center">
                <Time />
                <full-screen />
                <theme-mode />
                <data-v-button />
                <theme-panel />
                <user-dropdown />
            </n-space>
        </div>
        <Teleport to="body">
            <n-drawer
                class="lt-sm:block hidden"
                v-model:show="active"
                placement="left"
                :native-scrollbar="true"
            >
                <n-drawer-content class="relative">
                    <div class="py-12px">
                        <user-dropdown type="simple" />
                    </div>
                    <vertical-menu />

                    <div
                        class="absolute left-0px bottom-20px px-20px w-100% flex justify-between"
                    >
                        <theme-mode />

                        <logout />
                    </div>
                </n-drawer-content>
            </n-drawer>
        </Teleport>
    </n-layout-header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useThemeStore } from '@/store'
import { GlobalLogo } from '@/layouts/common'
import FullScreen from './components/FullScreen.vue'
import ThemeMode from './components/ThemeMode.vue'
import UserDropdown from './components/UserDropdown.vue'
import DataVButton from './components/DataVButton.vue'
import Logout from './components/Logout.vue'
import ThemePanel from '../ThemePanel/index.vue'
import { VerticalMenu } from '../GlobalSider/components'

const theme = useThemeStore()

const showTitle = ref(true)

const active = ref(false)
const activate = () => {
    active.value = true
}

const left = computed(() => theme.sider.width + 'px')
</script>
