/** 请求服务的环境配置 */
type ServiceEnv = Record<ServiceEnvType, ServiceEnvConfig>

/** 不同请求服务的环境配置 */
const serviceEnv: ServiceEnv = {
    dev: {
        // url: 'http://192.168.31.112:8086/',
        url: 'http://123.56.214.23:9086/',
        // url: 'http://192.168.31.112:8086/',
        // url: 'http://180.163.84.165:8086/',
        urlPattern: '/api'
        // secondUrl: 'http://localhost:8081/',
        // secondUrlPattern: '/second-url-pattern'
    },
    test: {
        // url: 'http://192.168.31.112:8086/',
        // url: 'http://192.168.31.226:8086/',
        // url: 'http://180.163.84.165:8086/',
        // url: 'http://123.56.214.23:9086/',
        url: 'http://192.168.31.112:8086/',
        urlPattern: '/api'
        // secondUrl: 'http://localhost:8081/',
        // secondUrlPattern: '/second-url-pattern'
    },
    prod: {
        // url: 'http://123.56.214.23:9086/',
        url: 'http://192.168.31.112:8086/',
        urlPattern: '/api'
        // secondUrl: 'http://localhost:8081/',
        // secondUrlPattern: '/second-url-pattern'
    }
}

/**
 * 获取当前环境模式下的请求服务的配置
 * @param env 环境
 */
export function getServiceEnvConfig(env: ViteEnv) {
    const { VITE_SERVICE_ENV = 'dev' } = env

    const config = serviceEnv[VITE_SERVICE_ENV]

    return config
}
