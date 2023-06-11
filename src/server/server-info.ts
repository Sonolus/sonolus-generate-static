import { Database, LocalizationText, ServerInfo } from 'sonolus-core'
import { toBackgroundItem } from './background-item'
import { toEffectItem } from './effect-item'
import { toEngineItem } from './engine-item'
import { toLevelItem } from './level-item'
import { toParticleItem } from './particle-item'
import { toSkinItem } from './skin-item'

export function toServerInfo(
    db: Database,
    localize: (text: LocalizationText) => string,
): ServerInfo {
    return {
        title: localize(db.info.title),
        banner: db.info.banner,
        levels: {
            items: db.levels.slice(0, 5).map((info) => toLevelItem(db, localize, info)),
            search: { options: [] },
        },
        skins: {
            items: db.skins.slice(0, 5).map((info) => toSkinItem(db, localize, info)),
            search: { options: [] },
        },
        backgrounds: {
            items: db.backgrounds.slice(0, 5).map((info) => toBackgroundItem(db, localize, info)),
            search: { options: [] },
        },
        effects: {
            items: db.effects.slice(0, 5).map((info) => toEffectItem(db, localize, info)),
            search: { options: [] },
        },
        particles: {
            items: db.particles.slice(0, 5).map((info) => toParticleItem(db, localize, info)),
            search: { options: [] },
        },
        engines: {
            items: db.engines.slice(0, 5).map((info) => toEngineItem(db, localize, info)),
            search: { options: [] },
        },
    }
}
