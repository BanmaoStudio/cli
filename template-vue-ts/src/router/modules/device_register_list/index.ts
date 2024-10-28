import { RouteRecordRaw } from "vue-router";
import IconDevice from "~icons/ph/trademark-registered";

const DeviceRegisterRoutes: RouteRecordRaw = {
  path: "/device_register_list",
  name: "DevicePage",
  meta: {
    title: "注册列表",
    requiresAuth: false,
    keepAlive: false,
    permissions: ["admin", "user"],
    icon: IconDevice,
    order: 2,
  },
  component: () => import("@/views/device_register_list/index.vue"),
};

export default DeviceRegisterRoutes;
