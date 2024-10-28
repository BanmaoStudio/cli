<template>
  <n-card class="shadow hover:shadow-xl">
    <template #header>
      <div class="flex-center">更换监控数据采集装置</div>
    </template>
    <n-form
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="left"
      label-width="auto"
      :show-require-mark="false"
      require-mark-placement="right-hanging"
      size="large"
    >
      <n-form-item label="原序列号" path="oldSkDeviceSn">
        <n-input
          v-model:value="model.oldSkDeviceSn"
          placeholder="原序列号"
          maxlength="24"
          clearable
        />
      </n-form-item>
      <n-form-item label="新序列号" path="skDeviceSn">
        <n-input
          v-model:value="model.skDeviceSn"
          placeholder="新序列号"
          maxlength="24"
          clearable
        />
      </n-form-item>

      <div class="flex justify-center">
        <n-button
          :disabled="disabled"
          type="primary"
          :loading="loading"
          @click="handleSubmit"
        >
          重新注册
        </n-button>
      </div>
    </n-form>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { FormInst, FormItemRule, useMessage } from "naive-ui";
import { useRegisterMachineStore } from "../store";

const store = useRegisterMachineStore();

const emit = defineEmits(["submit"]);

const model = ref({
  oldSkDeviceSn: "",
  skDeviceSn: "",
});

const disabled = ref<boolean>(true);
const loading = ref<boolean>(false);

const rules = {
  oldSkDeviceSn: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error("请输入原采集装置编号");
        } else if (value.length !== 24) {
          return new Error("原采集装置编号长度为24");
        } else {
          disabled.value = false;
        }
        return true;
      },
      trigger: ["blur", "input"],
    },
  ],
  skDeviceSn: [
    {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error("请输入新采集装置编号");
        } else if (value.length !== 24) {
          return new Error("新采集装置编号长度为24");
        } else {
          disabled.value = false;
        }
        return true;
      },
      trigger: ["blur", "input"],
    },
  ],
};

const formRef = ref<FormInst>();
const message = useMessage();

const handleStationData = () => {
  if (store.formData.isFirst === "0") {
    store.getStationFormData();
  }
};

const handleSubmit = (e: MouseEvent) => {
  e.preventDefault();
  loading.value = true;
  formRef.value?.validate(async (errors: any) => {
    if (!errors) {
      store.isFirstType("0");
      store.setSkDeviceSN(model.value.skDeviceSn);
      store.setOldSkDeviceSN(model.value.oldSkDeviceSn);

      handleStationData();

      setTimeout(() => {
        loading.value = false;
        emit("submit");
      }, 500);
    } else {
      loading.value = false;
      message.error("验证失败");
    }
  });
};
</script>
