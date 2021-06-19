import Ajv, { JTDSchemaType } from 'ajv/dist/jtd'
import { BackgroundInfo, backgroundInfoSchema } from './background-info'
import { EffectInfo, effectInfoSchema } from './effect-info'
import { EngineInfo, engineInfoSchema } from './engine-info'
import { LevelInfo, levelInfoSchema } from './level-info'
import { ParticleInfo, particleInfoSchema } from './particle-info'
import { SkinInfo, skinInfoSchema } from './skin-info'

export type DB = {
    levels: LevelInfo[]
    skins: SkinInfo[]
    backgrounds: BackgroundInfo[]
    effects: EffectInfo[]
    particles: ParticleInfo[]
    engines: EngineInfo[]
}

export const dbSchema: JTDSchemaType<DB> = {
    properties: {
        levels: { elements: levelInfoSchema },
        skins: { elements: skinInfoSchema },
        backgrounds: { elements: backgroundInfoSchema },
        effects: { elements: effectInfoSchema },
        particles: { elements: particleInfoSchema },
        engines: { elements: engineInfoSchema },
    },
}

export const dbParser = new Ajv().compileParser(dbSchema)

export function getByName<T extends { name: string }>(
    infos: T[],
    name: string,
    parent: string
): T {
    const info = infos.find((info) => info.name === name)
    if (!info) {
        throw `${parent}: ${name} not found`
    }
    return info
}
