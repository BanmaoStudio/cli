export const exportDataToCSV = async (
    fetchFunction: Function,
    params: any,
    fileName: string
) => {
    try {
        const res = await fetchFunction(params)
        const blob = new Blob([res.data], {
            type: 'application/vnd.ms-excel'
        })

        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    } catch (error) {
        console.error('Export failed:', error)
        throw error
    }
}
