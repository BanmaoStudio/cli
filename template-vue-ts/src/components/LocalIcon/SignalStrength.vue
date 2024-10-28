<template>
  <n-tooltip placement="right-end" trigger="hover">
    <template #trigger>
      <svg
        :width="props.width"
        :height="props.height"
        :viewBox="`0 0 ${hiddenText ? '74' : '32'} 21`"
      >
        <g fill="none">
          <path
            v-if="props.signal > 12 && props.signal <= 24"
            fill="#00ff88"
            stroke="#00ff88"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5.5 16.5v-3a1 1 0 1 1 2 0v3a1 1 0 0 1-2 0"
          />
          <path
            v-if="props.signal > 24 && props.signal <= 35"
            fill="#00ff88"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5.5 16.5v-3a1 1 0 1 1 2 0v3a1 1 0 0 1-2 0m4 0v-6a1 1 0 1 1 2 0v6a1 1 0 0 1-2 0"
          />

          <path
            v-if="props.signal > 35 && props.signal < 40"
            fill="#00ff88"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5.5 16.5v-3a1 1 0 1 1 2 0v3a1 1 0 0 1-2 0m4 0v-6a1 1 0 1 1 2 0v6a1 1 0 0 1-2 0m4 0v-9a1 1 0 1 1 2 0v9a1 1 0 0 1-2 0"
          />
          <path
            v-if="props.signal >= 40"
            fill="#00ff88"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5.5 16.5v-3a1 1 0 1 1 2 0v3a1 1 0 0 1-2 0m4 0v-6a1 1 0 1 1 2 0v6a1 1 0 0 1-2 0m4 0v-9a1 1 0 1 1 2 0v9a1 1 0 0 1-2 0m4 0v-12a1 1 0 1 1 2.5 0v12a1 1 0 0 1-2.5 0"
          />

          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5.5 16.5v-3a1 1 0 1 1 2 0v3a1 1 0 0 1-2 0m4 0v-6a1 1 0 1 1 2 0v6a1 1 0 0 1-2 0m4 0v-9a1 1 0 1 1 2 0v9a1 1 0 0 1-2 0m4 0v-12a1 1 0 1 1 2.5 0v12a1 1 0 0 1-2.5 0"
          />
        </g>
        <text
          v-if="hiddenText"
          x="24"
          y="17"
          fill="currentColor"
          font-size="16px"
        >
          {{ signalText }}
        </text>
        <g v-else>
          <text x="22" y="8" font-size="8px" style="text-anchor: start">
            {{ dBm }} dBm
          </text>
          <text x="22" y="18" font-size="8px" style="text-anchor: start">
            {{ props.signal }} asu
          </text>
        </g>
      </svg>
    </template>
    <n-space>
      <span>{{ dBm }}dBm</span>
      <span>{{ props.signal }}asu</span>
    </n-space>
  </n-tooltip>
</template>

<script lang="ts" setup>
interface Props {
  signal: number;
  hideText: boolean;
  width: string | number;
  height: string | number;
}

const props = withDefaults(defineProps<Props>(), {
  signal: 0,
  hideText: false,
  width: "4.5em",
  height: "2em",
});

const hiddenText = computed(() => {
  console.log(
    "%cSignalStrength.vue line:67 props.hideText",
    "color: #007acc;",
    props.hideText,
  );
  return !props.hideText;
});

const signalText = computed(() => {
  if (props.signal > 12 && props.signal <= 24) {
    return "信号弱"; // 'Low'
  } else if (props.signal > 24 && props.signal <= 35) {
    return "信号强"; // 'Medium'
  } else if (props.signal > 35 && props.signal < 40) {
    return "信号较强"; // 'High'
  } else if (props.signal >= 40) {
    return "信号最强"; // 'Critical'
  } else {
    return "无信号"; // 'No Signal'
  }
});

const dBm = computed(() => {
  return -113 + 2 * props.signal;
});
</script>
