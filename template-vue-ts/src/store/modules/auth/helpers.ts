import { localStg } from "@/utils/storage";

/** 获取token */
export function getToken() {
  return localStg.get("token") || "";
}

/** 获取用户信息 */
export function getUserInfo() {
  const emptyInfo: Auth.UserInfo = {
    userId: null,
    username: "",
    userRole: "user",
  };
  const userInfo: Auth.UserInfo = localStg.get("userInfo") || emptyInfo;

  return userInfo;
}

/** 去除用户相关缓存 */
export function clearAuthStorage() {
  localStg.remove("token");
  localStg.remove("userInfo");
}
