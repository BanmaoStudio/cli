import dayjs from 'dayjs'

export function useExportFile(data: any, fileName?: string) {
    const time = dayjs().format('yyyy-MM-dd hh:mm:ss')

    function transformBlob(data: any) {
        const blob = new Blob([data], {
            type: 'application/vnd.ms-excel'
            // type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })

        const href = window.URL.createObjectURL(blob)

        return href
    }

    function createElement() {
        const downloadElement = document.createElement('a')
        return downloadElement
    }

    function download() {
        const downloadDOM = createElement()
        const href = transformBlob(data)

        downloadDOM.href = href
        if (fileName) {
            downloadDOM.download = fileName || `${fileName}-${time}.xlsx`
        } else {
            downloadDOM.download = `${time}.xlsx`
        }

        document.body.appendChild(downloadDOM)
        downloadDOM.click()

        document.body.removeChild(downloadDOM)
        window.URL.revokeObjectURL(href)
    }

    download()
}
