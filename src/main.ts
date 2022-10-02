import { Command } from 'commander'
import {
    copySync,
    emptyDirSync,
    existsSync,
    outputJsonSync,
    readJsonSync,
    removeSync,
} from 'fs-extra'
import { Database, ItemDetails, ItemList, LocalizationText } from 'sonolus-core'
import { databaseParser } from './schemas/database'
import { Ordering, orderingParser } from './schemas/ordering'
import { Parser } from './schemas/parser'
import { toBackgroundItem } from './server/background-item'
import { toEffectItem } from './server/effect-item'
import { toEngineItem } from './server/engine-item'
import { toLevelItem } from './server/level-item'
import { toParticleItem } from './server/particle-item'
import { toServerInfo } from './server/server-info'
import { toSkinItem } from './server/skin-item'

const options = new Command()
    .name('sonolus-generate-static')
    .version('4.0.0')
    .option('-i, --input <value>', 'input directory', 'pack')
    .option('-o, --output <value>', 'output directory', 'static')
    .option('-l, --locale <value>', 'target locale', 'en')
    .option('-f, --fallback <value>', 'fallback locale', 'en')
    .parse()
    .opts()

const pathInput = options.input
const pathOutput = options.output
const targetLocale = options.locale
const fallbackLocale = options.fallback

try {
    console.log('[INFO]', 'Generating:', pathInput)
    console.log()

    emptyDirSync(pathOutput)

    const db = parse(databaseParser, `${pathInput}/db.json`)
    const ordering = existsSync(`${pathInput}/ordering.json`)
        ? parse(orderingParser, `${pathInput}/ordering.json`)
        : {}

    orderDb(db, ordering)

    console.log('[INFO]', `${pathOutput}/sonolus/info`)
    outputJsonSync(`${pathOutput}/sonolus/info`, toServerInfo(db, localize))

    outputItems('levels', db, db.levels, toLevelItem)
    outputItems('skins', db, db.skins, toSkinItem)
    outputItems('backgrounds', db, db.backgrounds, toBackgroundItem)
    outputItems('effects', db, db.effects, toEffectItem)
    outputItems('particles', db, db.particles, toParticleItem)
    outputItems('engines', db, db.engines, toEngineItem)

    console.log('[INFO]', `${pathOutput}/sonolus/repository`)
    copySync(`${pathInput}/repository`, `${pathOutput}/sonolus/repository`)

    console.log()
    console.log('[SUCCESS]', 'Generated to:', pathOutput)
} catch (error) {
    console.log()
    console.error('[FAILED]', error)

    removeSync(pathOutput)
}

function parse<T>(parser: Parser<T>, path: string): T {
    return parser(readJsonSync(path), path)
}

function localize(text: LocalizationText) {
    return (
        text[targetLocale] ||
        text[fallbackLocale] ||
        Object.values(text)[0] ||
        ''
    )
}

function orderDb(db: Database, ordering: Ordering) {
    orderInfos(db.levels, ordering.levels)
    orderInfos(db.skins, ordering.skins)
    orderInfos(db.backgrounds, ordering.backgrounds)
    orderInfos(db.effects, ordering.effects)
    orderInfos(db.particles, ordering.particles)
    orderInfos(db.engines, ordering.engines)
}

function orderInfos<T extends { name: string }>(
    infos: T[],
    names: string[] = []
) {
    infos.sort((a, b) => getSortOrder(a) - getSortOrder(b))

    function getSortOrder(info: T) {
        const index = names.indexOf(info.name)
        return index === -1 ? Number.POSITIVE_INFINITY : index
    }
}

function outputItems<
    T extends { name: string; description: LocalizationText },
    U
>(
    dirname: string,
    db: Database,
    infos: T[],
    toItem: (
        db: Database,
        localize: (text: LocalizationText) => string,
        info: T
    ) => U
) {
    infos.forEach((info, index) => {
        console.log('[INFO]', `${pathOutput}/sonolus/${dirname}/${info.name}`)
        const itemDetails: ItemDetails<U> = {
            item: toItem(db, localize, info),
            description: localize(info.description),
            recommended: infos
                .slice(index + 1, index + 6)
                .map((info) => toItem(db, localize, info)),
        }
        outputJsonSync(
            `${pathOutput}/sonolus/${dirname}/${info.name}`,
            itemDetails
        )
    })

    console.log('[INFO]', `${pathOutput}/sonolus/${dirname}/list`)
    const list: ItemList<U> = {
        pageCount: 1,
        items: infos.map((info) => toItem(db, localize, info)),
        search: { options: [] },
    }
    outputJsonSync(`${pathOutput}/sonolus/${dirname}/list`, list)
}
