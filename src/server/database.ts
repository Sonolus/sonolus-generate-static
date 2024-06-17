export const getByName = <T extends { name: string }>(
    items: T[],
    name: string,
    parent: string,
    path: string,
): T => {
    const item = items.find((item) => item.name === name)
    if (!item) throw new Error(`${parent}: ${name} not found (${path})`)

    return item
}
