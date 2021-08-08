import { JTDParser } from 'ajv/dist/jtd'
import { Command } from 'commander'
import {
    copySync,
    emptyDirSync,
    existsSync,
    outputJsonSync,
    readFileSync,
    removeSync,
} from 'fs-extra'
import { toBackgroundItem } from './api/background-item'
import { toEffectItem } from './api/effect-item'
import { toEngineItem } from './api/engine-item'
import { ItemDetails } from './api/item-details'
import { toLevelItem } from './api/level-item'
import { List } from './api/list'
import { toParticleItem } from './api/particle-item'
import { toServerInfo } from './api/server-info'
import { toSkinItem } from './api/skin-item'
import { DB, dbParser } from './jtd/db'
import { LocalizationText } from './jtd/localization-text'
import { Ordering, orderingParser } from './jtd/ordering'

const options = new Command()
    .name('sonolus-generate-static')
    .version('0.2.0')
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

    const db = parse(dbParser, `${pathInput}/db.json`)
    const ordering = existsSync(`${pathInput}/ordering.json`)
        ? parse(orderingParser, `${pathInput}/ordering.json`)
        : {}

    orderDb(db, ordering)

    console.log('[INFO]', `${pathOutput}/info`)
    outputJsonSync(`${pathOutput}/info`, toServerInfo(db, localize))

    outputItems('levels', db, db.levels, toLevelItem)
    outputItems('skins', db, db.skins, toSkinItem)
    outputItems('backgrounds', db, db.backgrounds, toBackgroundItem)
    outputItems('effects', db, db.effects, toEffectItem)
    outputItems('particles', db, db.particles, toParticleItem)
    outputItems('engines', db, db.engines, toEngineItem)

    console.log('[INFO]', `${pathOutput}/repository`)
    copySync(`${pathInput}/repository`, `${pathOutput}/repository`)

    console.log()
    console.log('[SUCCESS]', 'Generated to:', pathOutput)
} catch (error) {
    console.log()
    console.error('[FAILED]', error)

    removeSync(pathOutput)
}

function parse<T>(parser: JTDParser<T>, path: string): T {
    const data = parser(readFileSync(path, 'utf-8'))
    if (!data) {
        throw `${path}(${parser.position}): ${parser.message}`
    }
    return data
}

function localize(text: LocalizationText) {
    return (
        text[targetLocale] ||
        text[fallbackLocale] ||
        Object.values(text)[0] ||
        ''
    )
}

function orderDb(db: DB, ordering: Ordering) {
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
    db: DB,
    infos: T[],
    toItem: (db: DB, localize: (text: LocalizationText) => string, info: T) => U
) {
    infos.forEach((info, index) => {
        console.log('[INFO]', `${pathOutput}/${dirname}/${info.name}`)
        const itemDetails: ItemDetails<U> = {
            item: toItem(db, localize, info),
            description: localize(info.description),
            recommended: infos
                .slice(index + 1, index + 6)
                .map((info) => toItem(db, localize, info)),
        }
        outputJsonSync(`${pathOutput}/${dirname}/${info.name}`, itemDetails)
    })

    console.log('[INFO]', `${pathOutput}/${dirname}/list`)
    const list: List<U> = {
        pageCount: 1,
        items: infos.map((info) => toItem(db, localize, info)),
    }
    outputJsonSync(`${pathOutput}/${dirname}/list`, list)
}
