import { DatabasePostItem, PostItem } from '@sonolus/core'
import { toTags } from '../tag.js'
import { ToItem } from './item.js'

export const toPostItem: ToItem<DatabasePostItem, PostItem> = (sonolus, item) => ({
    name: item.name,
    source: sonolus.address,
    version: item.version,
    title: sonolus.localize(item.title),
    time: item.time,
    author: sonolus.localize(item.author),
    tags: toTags(sonolus.localize, item.tags),
    thumbnail: item.thumbnail,
})
