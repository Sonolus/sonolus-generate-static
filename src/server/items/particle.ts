import { DatabaseParticleItem, ParticleItem } from '@sonolus/core'
import { toTags } from '../tag.js'
import { ToItem } from './item.js'

export const toParticleItem: ToItem<DatabaseParticleItem, ParticleItem> = (sonolus, item) => ({
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
