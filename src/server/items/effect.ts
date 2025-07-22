import { DatabaseEffectItem, EffectItem } from '@sonolus/core'
import { toTags } from '../tag.js'
import { ToItem } from './item.js'

export const toEffectItem: ToItem<DatabaseEffectItem, EffectItem> = (sonolus, item) => ({
    name: item.name,
    source: sonolus.address,
    version: item.version,
    title: sonolus.localize(item.title),
    subtitle: sonolus.localize(item.subtitle),
    author: sonolus.localize(item.author),
    tags: toTags(sonolus.localize, item.tags),
    thumbnail: item.thumbnail,
    data: item.data,
    audio: item.audio,
})
