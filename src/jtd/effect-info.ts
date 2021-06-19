import { JTDSchemaType } from 'ajv/dist/jtd'
import { LocalizationText, localizationTextSchema } from './localization-text'
import { getSRLSchema, SRL } from './srl'

export type EffectInfo = {
    name: string
    version: number
    title: LocalizationText
    subtitle: LocalizationText
    author: LocalizationText
    description: LocalizationText
    thumbnail: SRL<'EffectThumbnail'>
    data: SRL<'EffectData'>
    meta?: unknown
}

export const effectInfoSchema: JTDSchemaType<EffectInfo> = {
    properties: {
        name: { type: 'string' },
        version: { type: 'uint32' },
        title: localizationTextSchema,
        subtitle: localizationTextSchema,
        author: localizationTextSchema,
        description: localizationTextSchema,
        thumbnail: getSRLSchema('EffectThumbnail'),
        data: getSRLSchema('EffectData'),
    },
    optionalProperties: {
        meta: {},
    },
}
