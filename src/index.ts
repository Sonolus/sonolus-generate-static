#! /usr/bin/env node

import {
    Database,
    Icon,
    ItemDetails,
    ItemInfo,
    ItemList,
    LocalizationText,
    PackageInfo,
    ServerInfo,
    Text,
    localize as sonolusLocalize,
} from '@sonolus/core'
import { Command } from 'commander'
import {
    copySync,
    emptyDirSync,
    existsSync,
    outputJsonSync,
    readJsonSync,
    removeSync,
} from 'fs-extra'
import { databaseParser } from './schemas/database'
import { Ordering, orderingParser } from './schemas/ordering'
import { Parser } from './schemas/parser'
import { toBackgroundItem } from './server/background-item'
import { toEffectItem } from './server/effect-item'
import { toEngineItem } from './server/engine-item'
import { ToItem } from './server/item'
import { toLevelItem } from './server/level-item'
import { toParticleItem } from './server/particle-item'
import { toPlaylistItem } from './server/playlist-item'
import { toPostItem } from './server/post-item'
import { toReplayItem } from './server/replay-item'
import { toSkinItem } from './server/skin-item'
import { Sonolus } from './server/sonolus'

const options = new Command()
    .name('sonolus-generate-static')
    .version('5.4.0')
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

const parse = <T>(parser: Parser<T>, path: string): T => parser(readJsonSync(path), path)

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

const orderItems = <T extends { name: string }>(items: T[], names: string[] = []) => {
    const getSortOrder = (item: T) => {
        const index = names.indexOf(item.name)
        return index === -1 ? Number.POSITIVE_INFINITY : index
    }

    items.sort((a, b) => getSortOrder(a) - getSortOrder(b))
}

const outputItems = <T extends { name: string; description: LocalizationText }, U>(
    dirname: string,
    sonolus: Sonolus,
    items: T[],
    toItem: ToItem<T, U>,
) => {
    items.forEach((item, index) => {
        console.log('[INFO]', `${pathOutput}/sonolus/${dirname}/${item.name}`)
        const itemDetails: ItemDetails<U> = {
            item: toItem(sonolus, item),
            description: sonolus.localize(item.description),
            sections: [
                {
                    title: Text.Recommended,
                    icon: Icon.Star,
                    items: items.slice(index + 1, index + 6).map((item) => toItem(sonolus, item)),
                },
            ],
        }
        outputJsonSync(`${pathOutput}/sonolus/${dirname}/${item.name}`, itemDetails)
    })

    console.log('[INFO]', `${pathOutput}/sonolus/${dirname}/list`)
    const list: ItemList<U> = {
        pageCount: 1,
        items: items.map((item) => toItem(sonolus, item)),
    }
    outputJsonSync(`${pathOutput}/sonolus/${dirname}/list`, list)

    console.log('[INFO]', `${pathOutput}/sonolus/${dirname}/info`)
    const itemInfo: ItemInfo<U> = {
        banner: sonolus.db.info.banner,
        sections: [
            {
                title: Text.Newest,
                items: items.slice(0, 5).map((item) => toItem(sonolus, item)),
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
        db: parse(databaseParser, `${pathInput}/db.json`),
        address,
        localize: (text) => sonolusLocalize(text, targetLocale, fallbackLocale),
    }

    const ordering = existsSync(`${pathInput}/ordering.json`)
        ? parse(orderingParser, `${pathInput}/ordering.json`)
        : {}
    orderDb(sonolus.db, ordering)

    console.log('[INFO]', `${pathOutput}/sonolus/info`)
    const serverInfo: ServerInfo = {
        title: sonolus.localize(sonolus.db.info.title),
        description: sonolus.db.info.description && sonolus.localize(sonolus.db.info.description),
        hasAuthentication: false,
        hasMultiplayer: false,
        banner: sonolus.db.info.banner,
    }
    outputJsonSync(`${pathOutput}/sonolus/info`, serverInfo)

    console.log('[INFO]', `${pathOutput}/sonolus/package`)
    const packageInfo: PackageInfo = {
        shouldUpdate: false,
    }
    outputJsonSync(`${pathOutput}/sonolus/package`, packageInfo)

    outputItems('posts', sonolus, sonolus.db.posts, toPostItem)
    outputItems('playlists', sonolus, sonolus.db.playlists, toPlaylistItem)
    outputItems('levels', sonolus, sonolus.db.levels, toLevelItem)
    outputItems('skins', sonolus, sonolus.db.skins, toSkinItem)
    outputItems('backgrounds', sonolus, sonolus.db.backgrounds, toBackgroundItem)
    outputItems('effects', sonolus, sonolus.db.effects, toEffectItem)
    outputItems('particles', sonolus, sonolus.db.particles, toParticleItem)
    outputItems('engines', sonolus, sonolus.db.engines, toEngineItem)
    outputItems('replays', sonolus, sonolus.db.replays, toReplayItem)

    console.log('[INFO]', `${pathOutput}/sonolus/repository`)
    copySync(`${pathInput}/repository`, `${pathOutput}/sonolus/repository`)

    console.log()
    console.log('[SUCCESS]', 'Generated to:', pathOutput)
} catch (error) {
    console.log()
    console.error('[FAILED]', error)

    removeSync(pathOutput)
}
