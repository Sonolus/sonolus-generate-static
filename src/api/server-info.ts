import { DB } from '../jtd/db'
import { LocalizationText } from '../jtd/localization-text'
import { BackgroundItem, toBackgroundItem } from './background-item'
import { EffectItem, toEffectItem } from './effect-item'
import { EngineItem, toEngineItem } from './engine-item'
import { LevelItem, toLevelItem } from './level-item'
import { ParticleItem, toParticleItem } from './particle-item'
import { SkinItem, toSkinItem } from './skin-item'

export type ServerInfo = {
    levels: LevelItem[]
    skins: SkinItem[]
    backgrounds: BackgroundItem[]
    effects: EffectItem[]
    particles: ParticleItem[]
    engines: EngineItem[]
}

export function toServerInfo(
    db: DB,
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
