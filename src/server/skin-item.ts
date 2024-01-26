import { DatabaseSkinItem, SkinItem } from 'sonolus-core'
import { ToItem } from './item'
import { toTags } from './tag'

export const toSkinItem: ToItem<DatabaseSkinItem, SkinItem> = (sonolus, item) => ({
    name: item.name,
    source: sonolus.address,
    version: item.version,
    title: sonolus.localize(item.title),
    subtitle: sonolus.localize(item.subtitle),
    author: sonolus.localize(item.author),
    tags: toTags(sonolus.localize, item.tags),
    thumbnail: item.thumbnail,
    data: item.data,
    texture: item.texture,
})
