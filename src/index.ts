#! /usr/bin/env node

import {
    Database,
    Icon,
    ItemType,
    LocalizationText,
    PackageInfo,
    ServerInfo,
    ServerItemDetails,
    ServerItemInfo,
    ServerItemList,
    ServerLevelResultInfo,
    Text,
    localize as sonolusLocalize,
} from '@sonolus/core'
import { Command } from 'commander'
import { copySync, emptyDirSync, existsSync, outputJsonSync, removeSync } from 'fs-extra'
import { databaseSchema } from './schemas/database'
import { Ordering, orderingSchema } from './schemas/ordering'
import { toBackgroundItem } from './server/items/background'
import { toEffectItem } from './server/items/effect'
import { toEngineItem } from './server/items/engine'
import { ToItem } from './server/items/item'
import { toLevelItem } from './server/items/level'
import { toParticleItem } from './server/items/particle'
import { toPlaylistItem } from './server/items/playlist'
import { toPostItem } from './server/items/post-item'
import { toReplayItem } from './server/items/replay'
import { toSkinItem } from './server/items/skin'
import { Sonolus } from './server/sonolus'
import { parse } from './utils/json'

const options = new Command()
    .name('sonolus-generate-static')
    .version('5.4.9')
    .option('-i, --input <value>', 'input directory', 'pack')
    .option('-o, --output <value>', 'output directory', 'static')
    .option('-a, --address [value]', 'address')
    .option('-l, --locale <value>', 'target locale', 'en')
    .option('-f, --fallback <value>', 'fallback locale', 'en')
    .parse()
    .opts()

const pathInput = options.input as string
const pathOutput = options.output as string
const address = options.address as string | undefined
const targetLocale = options.locale as string
const fallbackLocale = options.fallback as string

const orderDb = (db: Database, ordering: Ordering) => {
    orderItems(db.posts, ordering.posts)
    orderItems(db.playlists, ordering.playlists)
    orderItems(db.levels, ordering.levels)
    orderItems(db.skins, ordering.skins)
    orderItems(db.backgrounds, ordering.backgrounds)
    orderItems(db.effects, ordering.effects)
    orderItems(db.particles, ordering.particles)
    orderItems(db.engines, ordering.engines)
    orderItems(db.replays, ordering.replays)
}

const orderItems = (items: { name: string }[], names: string[] = []) => {
    const getSortOrder = (item: { name: string }) => {
        const index = names.indexOf(item.name)
        return index === -1 ? Number.POSITIVE_INFINITY : index
    }

    items.sort((a, b) => getSortOrder(a) - getSortOrder(b))
}

const outputItems = <T extends { name: string; description?: LocalizationText }, U>(
    dirname: string,
    sonolus: Sonolus,
    items: T[],
    itemType: ItemType,
    toItem: ToItem<T, U>,
) => {
    for (const [index, item] of items.entries()) {
        console.log('[INFO]', `${pathOutput}/sonolus/${dirname}/${item.name}`)
        const itemDetails: ServerItemDetails<U> = {
            item: toItem(sonolus, item),
            description: item.description && sonolus.localize(item.description),
            actions: [],
            hasCommunity: false,
            leaderboards: [],
            sections: [
                {
                    title: Text.Recommended,
                    icon: Icon.Star,
                    itemType,
                    items: items
                        .slice(index + 1, index + 6)
                        .map((item) => toItem(sonolus, item) as never),
                },
            ],
        }
        outputJsonSync(`${pathOutput}/sonolus/${dirname}/${item.name}`, itemDetails)
    }

    console.log('[INFO]', `${pathOutput}/sonolus/${dirname}/list`)
    const list: ServerItemList<U> = {
        pageCount: 1,
        items: items.map((item) => toItem(sonolus, item)),
    }
    outputJsonSync(`${pathOutput}/sonolus/${dirname}/list`, list)

    console.log('[INFO]', `${pathOutput}/sonolus/${dirname}/info`)
    const itemInfo: ServerItemInfo = {
        banner: sonolus.db.info.banner,
        sections: [
            {
                title: Text.Newest,
                itemType,
                items: items.slice(0, 5).map((item) => toItem(sonolus, item) as never),
            },
        ],
    }
    outputJsonSync(`${pathOutput}/sonolus/${dirname}/info`, itemInfo)
}

try {
    console.log('[INFO]', 'Generating:', pathInput)
    console.log()

    emptyDirSync(pathOutput)

    const sonolus: Sonolus = {
        db: parse(`${pathInput}/db.json`, databaseSchema),
        address,
        localize: (text) => sonolusLocalize(text, targetLocale, fallbackLocale),
    }

    const ordering = existsSync(`${pathInput}/ordering.json`)
        ? parse(`${pathInput}/ordering.json`, orderingSchema)
        : {}
    orderDb(sonolus.db, ordering)

    console.log('[INFO]', `${pathOutput}/sonolus/info`)
    const serverInfo: ServerInfo = {
        title: sonolus.localize(sonolus.db.info.title),
        description: sonolus.db.info.description && sonolus.localize(sonolus.db.info.description),
        buttons: (
            [
                ['post', 'posts'],
                ['playlist', 'playlists'],
                ['level', 'levels'],
                ['replay', 'replays'],
                ['skin', 'skins'],
                ['background', 'backgrounds'],
                ['effect', 'effects'],
                ['particle', 'particles'],
                ['engine', 'engines'],
            ] as const
        )
            .filter(([, type]) => sonolus.db[type].length)
            .map(([type]) => ({ type })),
        configuration: {
            options: [],
        },
        banner: sonolus.db.info.banner,
    }
    outputJsonSync(`${pathOutput}/sonolus/info`, serverInfo)

    console.log('[INFO]', `${pathOutput}/sonolus/package`)
    const packageInfo: PackageInfo = {}
    outputJsonSync(`${pathOutput}/sonolus/package`, packageInfo)

    outputItems('posts', sonolus, sonolus.db.posts, 'post', toPostItem)
    outputItems('playlists', sonolus, sonolus.db.playlists, 'playlist', toPlaylistItem)
    outputItems('levels', sonolus, sonolus.db.levels, 'level', toLevelItem)
    outputItems('skins', sonolus, sonolus.db.skins, 'skin', toSkinItem)
    outputItems('backgrounds', sonolus, sonolus.db.backgrounds, 'background', toBackgroundItem)
    outputItems('effects', sonolus, sonolus.db.effects, 'effect', toEffectItem)
    outputItems('particles', sonolus, sonolus.db.particles, 'particle', toParticleItem)
    outputItems('engines', sonolus, sonolus.db.engines, 'engine', toEngineItem)
    outputItems('replays', sonolus, sonolus.db.replays, 'replay', toReplayItem)

    console.log('[INFO]', `${pathOutput}/sonolus/levels/result/info`)
    const levelResultInfo: ServerLevelResultInfo = {}
    outputJsonSync(`${pathOutput}/sonolus/levels/result/info`, levelResultInfo)

    console.log('[INFO]', `${pathOutput}/sonolus/repository`)
    copySync(`${pathInput}/repository`, `${pathOutput}/sonolus/repository`)

    console.log()
    console.log('[SUCCESS]', 'Generated to:', pathOutput)
} catch (error) {
    console.log()
    console.error('[FAILED]', error)

    removeSync(pathOutput)
}
