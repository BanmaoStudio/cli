type Recordable<T = any> = Record<string, T>;

declare interface Fn<T = any, R = T> {
  (...arg: T[]): R;
}

declare type GetArrayItemType<T extends unknown[]> = T extends Array<infer S>
  ? S
  : never;

interface Window {
  $loadingBar?: import("naive-ui").LoadingBarProviderInst;
  $dialog?: import("naive-ui").DialogProviderInst;
  $message?: import("naive-ui").MessageProviderInst;
  $notification?: import("naive-ui").NotificationProviderInst;
}

interface Document {
  startViewTransition?: (
    callback: () => Promise<void> | void,
  ) => ViewTransition;
}

declare namespace Common {
  /**
   * 策略模式
   * [状态, 为true时执行的回调函数]
   */
  type StrategyAction = [boolean, () => void];

  /** 选项数据 */
  type OptionWithKey<K> = { value: K; label: string };
}
