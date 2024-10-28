<template>
    <n-breadcrumb class="py-4px px-12px mt-2px">
        <!-- <n-breadcrumb-item>
      首页
    </n-breadcrumb-item> -->
        <n-breadcrumb-item
            v-for="breadcrumb in breadcrumbList"
            :key="breadcrumb.name"
        >
            <router-link :to="breadcrumb.path">
                {{ breadcrumb.meta.title }}
            </router-link>
        </n-breadcrumb-item>
    </n-breadcrumb>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// console.log(route)

const breadcrumbList = ref<any[]>()

breadcrumbList.value = route.matched

watch(
    () => route,
    (v) => {
        // console.log(v)
        breadcrumbList.value = v.matched
    },
    {
        deep: true,
        immediate: true
    }
)
</script>
