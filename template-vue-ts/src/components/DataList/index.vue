<template>
  <n-card>
    <n-list>
      <n-list-item v-for="item in dataSource" :key="item.id">
        <n-thing :title="item.siteName + ' ' + item.tankerName">
          <template #header-extra>
            <SignalStrength width="4em" height="1em" :signal="Number(item.sk4gSignalIntensity)" hide-text />
          </template>
          <template #description>
            <n-space>
              <n-text>{{ item.skDeviceSn }}</n-text>
              <n-tag v-if="item.skRegisterFlag === 0" size="tiny" type="warning">未注册</n-tag>
              <n-tag v-if="item.skRegisterFlag === 1" size="tiny" type="info">注册中</n-tag>
              <n-tag v-if="item.skRegisterFlag === 2" size="tiny">已注册</n-tag>
            </n-space>
          </template>
          <div class="flex justify-between">
            <div>mcu: v{{ item.skMcuFirmwareVer }}</div>
            <div>4G固件: v{{ item.sk4gFirmwareVer }}</div>
          </div>
          <template #action>
            <n-space>
              <n-button type="primary" tertiary size="tiny">
                <template #icon>
                  <icon-carbon-intent-request-create />
                </template>
                {{ item.skRegisterFlag === 1 ? "去注册" : "重新注册" }}
              </n-button>
              <n-button
type="primary" tertiary size="tiny" :disabled="item.skMcuFlag !== 2"
                @click="() => handleUpgradeVersionModal('mcu', item)">
                <template #icon>
                  <icon-carbon-upgrade class="text-16px" />
                </template>
                mcu升级
              </n-button>
              <n-button
type="primary" tertiary size="tiny" :disabled="item.sk4gFlag !== 2"
                @click="() => handleUpgradeVersionModal('4g', item)">
                <template #icon>
                  <icon-carbon-upgrade class="text-16px" />
                </template>
                4G固件升级
              </n-button>
            </n-space>
          </template>
        </n-thing>
      </n-list-item>
    </n-list>
    <template #footer>
      <div class="flex justify-end">
        <n-pagination
v-bind="pagination" show-size-picker :pageSizes="[10, 20, 50, 100]" :pageSlot="4"
          @update:page="handlePageChange" @update:page-size="handlePageSizeChange" />
      </div>
    </template>
  </n-card>
</template>

<script setup lang="ts">
interface ListProps {
  list: any[];
  loading: boolean;
  pagination: any;

}
defineProps<ListProps>()

</script>
