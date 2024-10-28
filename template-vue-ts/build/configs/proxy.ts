import type { ProxyOptions } from 'vite';

/**
 * 设置网络代理
 * @param isOpenProxy - 是否开启代理
 * @param envConfig - env环境配置
 */
export function createViteProxy(isOpenProxy: boolean, envConfig: ServiceEnvConfig) {
  // console.log('isOpenProxy: ', isOpenProxy);
  if (!isOpenProxy) return undefined;

  console.log('in Proxy: ', envConfig)

  const proxy: Record<string, string | ProxyOptions> = {
    [envConfig.urlPattern]: {
      target: envConfig.url,
      changeOrigin: true,
      rewrite: path => path.replace(new RegExp(`^\${envConfig.urlPattern}`), '')
    },
  };

  return proxy;
}
