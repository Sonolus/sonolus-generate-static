import { DatabaseLevelItem, DatabaseUseItem, LevelItem, UseItem } from '@sonolus/core'
import { getByName } from '../database.js'
import { Sonolus } from '../sonolus.js'
import { toTags } from '../tag.js'
import { toBackgroundItem } from './background.js'
import { toEffectItem } from './effect.js'
import { toEngineItem } from './engine.js'
import { ToItem } from './item.js'
import { toParticleItem } from './particle.js'
import { toSkinItem } from './skin.js'

export const toLevelItem: ToItem<DatabaseLevelItem, LevelItem> = (sonolus, item) => ({
    name: item.name,
    source: sonolus.address,
    version: item.version,
    rating: item.rating,
    engine: toEngineItem(
        sonolus,
        getByName(sonolus.db.engines, item.engine, `Level/${item.name}`, '/engine'),
    ),
    useSkin: toUseItem(
        sonolus,
        toSkinItem,
        item.useSkin,
        sonolus.db.skins,
        `Level/${item.name}`,
        '/useSkin/item',
    ),
    useBackground: toUseItem(
        sonolus,
        toBackgroundItem,
        item.useBackground,
        sonolus.db.backgrounds,
        `Level/${item.name}`,
        '/useBackground/item',
    ),
    useEffect: toUseItem(
        sonolus,
        toEffectItem,
        item.useEffect,
        sonolus.db.effects,
        `Level/${item.name}`,
        '/useEffect/item',
    ),
    useParticle: toUseItem(
        sonolus,
        toParticleItem,
        item.useParticle,
        sonolus.db.particles,
        `Level/${item.name}`,
        '/useParticle/item',
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
