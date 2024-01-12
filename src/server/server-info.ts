import { Database, LocalizationText, Section, ServerInfo } from 'sonolus-core'
import { toBackgroundItem } from './background-item'
import { toEffectItem } from './effect-item'
import { toEngineItem } from './engine-item'
import { toLevelItem } from './level-item'
import { toParticleItem } from './particle-item'
import { toReplayItem } from './replay-item'
import { toSkinItem } from './skin-item'

export const toServerInfo = (
    db: Database,
    localize: (text: LocalizationText) => string,
): ServerInfo => ({
    title: localize(db.info.title),
    banner: db.info.banner,
    levels: toSection(db, localize, db.levels, toLevelItem),
    skins: toSection(db, localize, db.skins, toSkinItem),
    backgrounds: toSection(db, localize, db.backgrounds, toBackgroundItem),
    effects: toSection(db, localize, db.effects, toEffectItem),
    particles: toSection(db, localize, db.particles, toParticleItem),
    engines: toSection(db, localize, db.engines, toEngineItem),
    replays: toSection(db, localize, db.replays, toReplayItem),
})

const toSection = <T, U>(
    db: Database,
    localize: (text: LocalizationText) => string,
    infos: T[],
    toItem: (db: Database, localize: (text: LocalizationText) => string, info: T) => U,
): Section<U> => ({
    items: infos.slice(0, 5).map((info) => toItem(db, localize, info)),
    search: { options: [] },
})
