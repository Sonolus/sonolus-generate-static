import { Database, LocalizationText, ServerInfo } from 'sonolus-core'
import { toBackgroundItem } from './background-item'
import { toEffectItem } from './effect-item'
import { toEngineItem } from './engine-item'
import { toLevelItem } from './level-item'
import { toParticleItem } from './particle-item'
import { toSkinItem } from './skin-item'

export function toServerInfo(
    db: Database,
    localize: (text: LocalizationText) => string
): ServerInfo {
    return {
        levels: db.levels
            .slice(0, 5)
            .map((info) => toLevelItem(db, localize, info)),
        skins: db.skins
            .slice(0, 5)
            .map((info) => toSkinItem(db, localize, info)),
        backgrounds: db.backgrounds
            .slice(0, 5)
            .map((info) => toBackgroundItem(db, localize, info)),
        effects: db.effects
            .slice(0, 5)
            .map((info) => toEffectItem(db, localize, info)),
        particles: db.particles
            .slice(0, 5)
            .map((info) => toParticleItem(db, localize, info)),
        engines: db.engines
            .slice(0, 5)
            .map((info) => toEngineItem(db, localize, info)),
    }
}
