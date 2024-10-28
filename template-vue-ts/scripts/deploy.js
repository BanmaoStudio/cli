/**
 * 项目部署脚本
 *
 * 使用方法：npm run deploy
 *
 * 环境变量：
 * 服务器信息为敏感信息数据，建议在 .env.local 文件中设置以下环境变量：
 * SOURCE_PATH: 项目源路径（默认）
 * REMOTE_PATH: 远程路径（默认）
 * REMOTE_IP: 远程服务器IP
 * REMOTE_USER: 远程服务器用户名（默认root）
 * REMOTE_PASSWD: 远程服务器密码（可选）
 * <PROJECT_NAME>_SOURCE_PATH: 项目源路径（可选）
 * <PROJECT_NAME>_REMOTE_PATH: 项目远程路径（可选）
 *
 * package.json 配置：
 * "scripts": {
 *
 *   "deploy": "node --env-file=.env.local scripts/deploy.js"
 * }
 */
import process from 'node:process'
import minimist from 'minimist'
import Rsync from 'rsync'

import { scp } from 'scp2'
import ora from 'ora'
import chalk from 'chalk'
import { Client } from 'ssh2'

const spinner = ora('正在发布到服务器...')

function getProjectNameByScript() {
    return minimist(process.argv.slice(2))
}

function getParamsByEnv(project) {
    const source_name = project ? `${project}_SOURCE_PATH` : 'SOURCE_PATH'
    const target_name = project ? `${project}_REMOTE_PATH` : 'REMOTE_PATH'

    const ip = process.env.REMOTE_IP
    const user = process.env.REMOTE_USER || 'root'
    const passwd = process.env.REMOTE_PASSWD
    const remote_path = process.env[target_name]
    const source_path = process.env[source_name]

    return {
        ip,
        user,
        passwd,
        remote_path,
        source_path
    }
}

function rsyncExecutor({ source_path, remote_path, user, ip }) {
    if (!source_path || !remote_path)
        throw new Error('source_path and remote_path are required')

    if (!ip || !user) throw new Error('ip and user are required')

    const target = `${user}@${ip}:${remote_path}`

    const rsync = new Rsync()

    const rsyncCmd = rsync
        .flags('avzh')
        .shell('ssh')
        .delete()
        .update()
        .progress()
        .source(source_path)
        .chmod('755')
        .owner()
        .group()
        .destination(target)

    rsyncCmd.execute(
        (_err, _code, cmd) => {
            console.log('All done executing', cmd)
        },
        (data) => {
            console.log('data: ', data.toString())
        },
        (data) => {
            console.log('data: ', data.toString())
        }
    )
}

function scpExecutor({ source_path, remote_path, user, passwd, ip }) {
    const conn = new Client()

    conn.on('ready', () => {
        if (!remote_path) {
            console.log(chalk.red('remote_path is required'))

            conn.end()
            return false
        }

        conn.exec(`rm -rf ${remote_path}/*`, function (err, stream) {
            console.log(chalk.blue('删除远程目录文件'))
            if (err) throw err

            stream
                .on('close', (code, signal) => {
                    console.log(chalk.green('删除远程目录成功'))
                    console.log(chalk.blue('开始上传文件'))
                    spinner.start()
                    scp(
                        source_path,
                        {
                            host: ip,
                            username: user,
                            password: passwd,
                            path: remote_path
                        },
                        (err) => {
                            spinner.stop()
                            if (!err) {
                                console.log(chalk.green('上传文件成功'))
                            } else {
                                console.log(chalk.red('上传文件失败'))
                                console.log(err)
                            }
                        }
                    )
                    conn.end()
                })
                .on('data', (data) => {
                    console.log('STDOUT: ' + data)
                })
                .stderr.on('data', (data) => {
                    console.log('STDERR: ' + data)
                })
        })
    }).connect({
        host: ip,
        port: 22,
        username: user,
        password: passwd
    })
}

function init() {
    const projectName = getProjectNameByScript()?.project?.toUpperCase()
    const method = getProjectNameByScript()?.m?.toUpperCase()

    const config = getParamsByEnv(projectName)
    if (method === 'SCP') {
        scpExecutor(config)
    } else {
        rsyncExecutor(config)
    }
}

init()
