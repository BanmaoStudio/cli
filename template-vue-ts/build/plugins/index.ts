import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJSX from '@vitejs/plugin-vue-jsx';
import unocss from 'unocss/vite';
import unplugin from './unplugin';
import html from './html';
import mock from './mock';
import compress from './compress'
import visualizer from './visualizer'
import pwa from './pwa'
import { presetUno, presetAttributify, presetIcons } from 'unocss'
// import basicSSL from '@vitejs/plugin-basic-ssl'
// import mkcert from 'vite-plugin-mkcert'

/**
 * vite 插件
 * @param viteEnv - 环境变量配置
 */
export function setupVitePlugins(viteEnv: ViteEnv) {

  const plugins: (PluginOption | PluginOption[])[] = [
    /** Vue支持 */
    vue(),
    /** JSX支持 */
    vueJSX(),
    // mkcert({ hosts: ['shop1.com.cn', 'shop1.xxx.com']}),
    /** 原子CSS */
    unocss({
      presets: [
        presetAttributify(),
        presetIcons()
      ]
    }),
    html(viteEnv),
    ...unplugin(viteEnv),
    // mock,
  ]

  if (viteEnv.VITE_COMPRESS) {
    plugins.push(compress(viteEnv))
  }
  if (viteEnv.VITE_VISUALIZER) {
    plugins.push(visualizer as PluginOption)
  }
  if (viteEnv.VITE_PWA || viteEnv.VITE_NETLIFY) {
    plugins.push(pwa(viteEnv))
  }

  return plugins
}
