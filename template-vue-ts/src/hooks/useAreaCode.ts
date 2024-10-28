import { fetchAreaCode, fetchAllAreaCode } from "@/services";
import { SelectOption } from "naive-ui";

export function useAreaCode(areaCode?: string, mode?: 'all' | ''): any {
  // 实现逻辑
  const areaCodeList = ref<any>([]);

  const provinceOptions = ref<any[]>()
  const cityOptions = ref<any[]>()
  const countyOptions = ref<any[]>()
  const townOptions = ref<any[]>()

  const judgeAreaLevel = (areaCode) => {
    switch (areaCode) {
      case /(?<=^\d{2})[\d]{0,7}$/g.test(areaCode):
        return 'province'
      case /^(?!0000)\d{1,4}0{5}$/g.test(areaCode):
        return 'city'
      case /^(?!000000){6,}0{3}$/g.test(areaCode):
        return 'county'
      case /^(?!000000000)$/g.test(areaCode):
        return 'town'
    }
  }

  const loadData = async () => {
    try {
      const res = await fetchAreaCode(areaCode);
      const { status, data } = res;
      if (status === 0) {
        // areaCodeList.value = data.map(item => ({ label: item.name, value: item.code}));
        areaCodeList.value = data;
      }
    } catch (error) {
      throw new Error(error as string);
    }
  };

  const allAreaCodeList = ref<any[]>()


  class TreeNode {
    data: any;
    children: any[];
    constructor(data?: any) {
      this.data = data;
      this.children = [];
    }
  }
  function arrayToTree(arr) {
    const root = new TreeNode();
    const lookup = new Map();

    for (const item of arr) {
      lookup.set(item.id, item);
    }
    for (const item of arr) {
      const node = new TreeNode(item);
      root.children.push(node);

      if (item.pid) {
        const parent = lookup.get(item.parentId)
        if (parent) {
          parent.children.push(node);
        }
      }
    }

    return root;
  }

  const loadAllData = async () => {
    try {
      const res = await fetchAllAreaCode();
      const { status, data } = res;
      if (status === 0) {
        // areaCodeList.value = data.map(item => ({ label: item.name, value: item.code}));
        allAreaCodeList.value = data;
      }
    } catch (error) {
      throw new Error(error as string);
    }
  };

  onMounted(() => {
    if (mode === 'all') {
      loadAllData();
    } else {
      loadData();
    }
  });

  return {
    areaCodeList,
    allAreaCodeList,
    provinceOptions,
    cityOptions,
    countyOptions,
    townOptions,
    getAreaCode: loadData,
    getAllAreaCode: loadAllData,
  };
}
