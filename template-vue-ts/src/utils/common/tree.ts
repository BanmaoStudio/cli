export function toTree(data: any[], parentId: number | null = null) {
    const treeData: any[] = []
    data.forEach((item: any) => {
        if (item.pid === parentId) {
            const children = toTree(data, item.id)
            if (children.length) item.children = children

            treeData.push(item)
        }
    })
    return treeData
}
