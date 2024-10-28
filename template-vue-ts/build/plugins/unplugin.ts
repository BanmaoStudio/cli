import DefineOptions from 'unplugin-vue-define-options/vite';
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite';
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { getSrcPath } from '../utils';

export default function unplugin(viteEnv: ViteEnv) {
  const { VITE_ICON_PREFFIX, VITE_ICON_LOCAL_PREFFIX } = viteEnv;

  const srcPath = getSrcPath()
  const localIconPath = `${srcPath}/assets/svg-icon`;

  /** 本地svg图标集合名称 */
  const collectionName = VITE_ICON_LOCAL_PREFFIX.replace(`${VITE_ICON_PREFFIX}-`, '');

  return [
    DefineOptions(),
    Icons({
      compiler: 'vue3',
      customCollections: {
        [collectionName]: FileSystemIconLoader(localIconPath, svg =>
          svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')
        )
      },
      scale: 1,
      defaultClass: 'inline-block'
    }),
    AutoImport({
      imports: [
        'vue',
        // 'vue-router',
        // '@vueuse/core',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar'
          ]
        }
      ],
      // 调整自动引入的文件位置
      dts: 'types/auto-import.d.ts',
    }),
    Components({
      dts: 'types/components.d.ts',
      types: [{ from: 'vue-router', names: ['RouterLink', 'RouterView'] }],
      resolvers: [
        NaiveUiResolver(),
        IconsResolver({
          customCollections: [collectionName],
          componentPrefix: VITE_ICON_PREFFIX
        })
      ],
    }),
    createSvgIconsPlugin({
      iconDirs: [localIconPath],
      symbolId: `${VITE_ICON_LOCAL_PREFFIX}-[dir]-[name]`,
      inject: 'body-last',
      customDomId: '__SVG_ICON_LOCAL__'
    })
  ];
}
