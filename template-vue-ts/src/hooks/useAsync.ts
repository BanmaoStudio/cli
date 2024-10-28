import { onMounted, reactive, toRefs } from "vue";

export function useAsync(
  { request, params }: { request: any; params?: any },
  callback?: Function,
) {
  const result = reactive({
    data: {},
    loading: false,
  });

  const loading = (loading: boolean) => {
    result.loading = loading;
  };

  const run = async (params = {}) => {
    try {
      loading(true);
      const res = await request({
        ...params,
      });

      const data = (callback && callback(res)) || res;

      result.data = data;

      return data ? data : {};
    } catch (error) {
      loading(false);
    } finally {
      loading(false);
    }
  };

  run(params);
  onMounted(() => {
    run(params);
  });

  return {
    ...toRefs(result),
    run,
  };
}
