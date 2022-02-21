import {
    Database,
    EngineInfo,
    EngineItem,
    LocalizationText,
} from 'sonolus-core'
import { getByName } from '../schemas/database'
import { toBackgroundItem } from './background-item'
import { toEffectItem } from './effect-item'
import { toParticleItem } from './particle-item'
import { toSkinItem } from './skin-item'

export function toEngineItem(
    db: Database,
    localize: (text: LocalizationText) => string,
    info: EngineInfo
): EngineItem {
    return {
        name: info.name,
        version: info.version,
        title: localize(info.title),
        subtitle: localize(info.subtitle),
        author: localize(info.author),
        skin: toSkinItem(
            db,
            localize,
            getByName(db.skins, info.skin, `Engine/${info.name}`)
        ),
        background: toBackgroundItem(
            db,
            localize,
            getByName(db.backgrounds, info.background, `Engine/${info.name}`)
        ),
        effect: toEffectItem(
            db,
            localize,
            getByName(db.effects, info.effect, `Engine/${info.name}`)
        ),
        particle: toParticleItem(
            db,
            localize,
            getByName(db.particles, info.particle, `Engine/${info.name}`)
        ),
        thumbnail: info.thumbnail,
        data: info.data,
        rom: info.rom,
        configuration: info.configuration,
    }
}
