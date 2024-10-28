import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import fs from 'fs'
import { createViteProxy, setupVitePlugins, viteDefine } from './build'
import { getServiceEnvConfig } from './.env-config'

// https://vitejs.dev/config/
export default defineConfig((configEnv) => {
    const viteEnv = loadEnv(configEnv.mode, process.cwd()) as unknown as ViteEnv

    const isOpenProxy = Boolean(viteEnv.VITE_HTTP_PROXY)
    const envConfig = getServiceEnvConfig(viteEnv)

    return {
        base: viteEnv.VITE_BASE_URL,
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src/'),
                '#': path.resolve(__dirname, 'types/')
            }
        },
        define: viteDefine,
        plugins: setupVitePlugins(viteEnv),
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: '@use "./src/styles/scss/global.scss" as *;'
                }
            }
        },
        logLevel: 'info',
        server: {
            host: true,
            port: 3000,
            open: true,
            // https: true,
            // https: {
            //   key: fs.readFileSync('keys/agent2-key.pem'),
            //   cert: fs.readFileSync('keys/agent2-cert.pem')
            // },
            proxy: createViteProxy(isOpenProxy, envConfig)
        },
        optimizeDeps: {
            include: ['@better-scroll/core', 'echarts', 'swiper']
        },
        build: {
            minify: 'terser',
            terserOptions: {
                compress: {
                    drop_console: true,
                    drop_debugger: true
                }
            },
            rollupOptions: {
                output: {
                    chunkFileNames: 'js/[name]-[hash].js',
                    entryFileNames: 'js/[name]-[hash].js',
                    assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
                }
            },
            reportCompressedSize: false,
            sourcemap: false,
            commonjsOptions: {
                ignoreTryCatch: false
            }
        }
    }
})
