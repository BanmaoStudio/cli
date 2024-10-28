import {defineStore} from "pinia";
import {ref} from "vue";
import {deletePackageById, fetchPackageList, fetchPackageWithCreate, fetchPackageWithUpdate,} from "./service";
import type {PackageForm, VersionListItem, VersionListRequest,} from "./types";
import {EnumResponseCode} from "@/enums";
import config from "@/config";

export const useVersionManageStore = defineStore("version-manage-store", () => {
  const dataSource = ref<VersionListItem[]>();
  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  async function getDataList(data: VersionListRequest) {
    try {
      const result = await fetchPackageList(data);
      if (result) {
        const { list, pageNum: page, pageSize, total } = result;

        dataSource.value = list;
        pagination.value = {
          page,
          pageSize,
          total,
        };
      }

      return result;
    } catch (error) {
      throw new Error("Invalid:" + error);
    }
  }

  async function addData(data: Omit<PackageForm, "id">) {
    try {
      const result = await fetchPackageWithCreate(data);
      if (result) {
        return result;
      }
    } catch (error) {
      throw new Error("Invalid: " + error);
    }
  }

  async function editData(
    data: PackageForm,
  ) {
    try {
      return await fetchPackageWithUpdate(data);
    } catch (error) {
      throw new Error("Invalid: " + error);
    }
  }

  async function deleteData(id: number) {
    try {
      const result: any = await deletePackageById(id);
      if (result[config.responseStatus] === EnumResponseCode.SUCCESS) {
      }
      return result;
    } catch (error) {
      throw new Error("Invalid: " + error);
    }
  }

  return {
    dataSource,
    pagination,
    getDataList,
    addData,
    editData,
    deleteData,
  };
});
