import { DatabaseEngineItem, EngineItem } from '@sonolus/core'
import { getByName } from '../schemas/database'
import { toBackgroundItem } from './background-item'
import { toEffectItem } from './effect-item'
import { ToItem } from './item'
import { toParticleItem } from './particle-item'
import { toSkinItem } from './skin-item'
import { toTags } from './tag'

export const toEngineItem: ToItem<DatabaseEngineItem, EngineItem> = (sonolus, item) => ({
    name: item.name,
    source: sonolus.address,
    version: item.version,
    title: sonolus.localize(item.title),
    subtitle: sonolus.localize(item.subtitle),
    author: sonolus.localize(item.author),
    tags: toTags(sonolus.localize, item.tags),
    skin: toSkinItem(
        sonolus,
        getByName(sonolus.db.skins, item.skin, `Engine/${item.name}`, '.skin'),
    ),
    background: toBackgroundItem(
        sonolus,
        getByName(sonolus.db.backgrounds, item.background, `Engine/${item.name}`, '.background'),
    ),
    effect: toEffectItem(
        sonolus,
        getByName(sonolus.db.effects, item.effect, `Engine/${item.name}`, '.effect'),
    ),
    particle: toParticleItem(
        sonolus,
        getByName(sonolus.db.particles, item.particle, `Engine/${item.name}`, '.particle'),
    ),
    thumbnail: item.thumbnail,
    playData: item.playData,
    watchData: item.watchData,
    previewData: item.previewData,
    tutorialData: item.tutorialData,
    rom: item.rom,
    configuration: item.configuration,
})
