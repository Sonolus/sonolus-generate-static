import { DatabaseLevelItem, DatabaseUseItem, LevelItem, UseItem } from '@sonolus/core'
import { getByName } from '../schemas/database'
import { toBackgroundItem } from './background-item'
import { toEffectItem } from './effect-item'
import { toEngineItem } from './engine-item'
import { ToItem } from './item'
import { toParticleItem } from './particle-item'
import { toSkinItem } from './skin-item'
import { Sonolus } from './sonolus'
import { toTags } from './tag'

export const toLevelItem: ToItem<DatabaseLevelItem, LevelItem> = (sonolus, item) => ({
    name: item.name,
    source: sonolus.address,
    version: item.version,
    rating: item.rating,
    engine: toEngineItem(
        sonolus,
        getByName(sonolus.db.engines, item.engine, `Level/${item.name}`, '.engine'),
    ),
    useSkin: toUseItem(
        sonolus,
        toSkinItem,
        item.useSkin,
        sonolus.db.skins,
        `Level/${item.name}`,
        '.useSkin.item',
    ),
    useBackground: toUseItem(
        sonolus,
        toBackgroundItem,
        item.useBackground,
        sonolus.db.backgrounds,
        `Level/${item.name}`,
        '.useBackground.item',
    ),
    useEffect: toUseItem(
        sonolus,
        toEffectItem,
        item.useEffect,
        sonolus.db.effects,
        `Level/${item.name}`,
        '.useEffect.item',
    ),
    useParticle: toUseItem(
        sonolus,
        toParticleItem,
        item.useParticle,
        sonolus.db.particles,
        `Level/${item.name}`,
        '.useParticle.item',
    ),
    title: sonolus.localize(item.title),
    artists: sonolus.localize(item.artists),
    author: sonolus.localize(item.author),
    tags: toTags(sonolus.localize, item.tags),
    cover: item.cover,
    bgm: item.bgm,
    preview: item.preview,
    data: item.data,
})

const toUseItem = <T extends { name: string }, U>(
    sonolus: Sonolus,
    toItem: ToItem<T, U>,
    useItem: DatabaseUseItem,
    items: T[],
    parent: string,
    path: string,
): UseItem<U> =>
    useItem.useDefault
        ? {
              useDefault: true,
          }
        : {
              useDefault: false,
              item: toItem(sonolus, getByName(items, useItem.item, parent, path)),
          }
