<template>
  <div class="nox-header">
    <div class="nox-header-wrapper">
      <div class="flex-y-center">
        <div class="back" @click="back">
          <slot v-if="$slots.back"></slot>
          <icon-ant-design-arrow-left-outlined v-else />
        </div>
        <div class="title">
          <slot v-if="$slots.title"></slot>
          <div v-else class="title_text">{{ props.title }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string;
}

const props = withDefaults(defineProps<Props>(), { title: "标题" });

const emits = defineEmits(["back"]);

const back = () => {
  emits("back");
};
</script>

<style scoped lang="scss">
.nox-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  box-shadow: 0 0px 2px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  background-color: rgba(255, 255, 255, 0.075);

  &-wrapper {
    margin: 0 auto;
    width: 860px;
  }

  .back {
    cursor: pointer;
    padding: 0 10px;
    font-size: 26px;
  }

  .title {
    flex: 1;
    text-align: center;
    font-size: 22px;
    font-weight: bold;
    letter-spacing: 2px;
  }
}
</style>
