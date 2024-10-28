import type { PluginOption } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'

export default (viteEnv: ViteEnv): PluginOption[] => {
  return createHtmlPlugin({
    minify: true,
    inject: {
      data: {
        title: viteEnv.VITE_APP_TITLE,
        appName: viteEnv.VITE_APP_NAME,
        appTitle: viteEnv.VITE_APP_TITLE,
        tags: [],
      },
    },
    /**
     * 如果你使用的 vite 版本高于 5.0.0-beta.13，可以将 viteNext 设置为 true 来进行兼容
     */
    viteNext: true,
  })
}
