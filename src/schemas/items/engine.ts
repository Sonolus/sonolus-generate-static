import { Type } from '@sinclair/typebox'
import { DatabaseEngineItem } from '@sonolus/core'
import { Expect } from '../../utils/test'
import { localizationTextSchema } from '../localizationText'
import { srlSchema } from '../srl'
import { databaseTagSchema } from '../tag'
import { SchemaToMatch } from '../test'

export const databaseEngineItemSchema = Type.Object({
    name: Type.String(),
    version: Type.Literal(12),
    title: localizationTextSchema,
    subtitle: localizationTextSchema,
    author: localizationTextSchema,
    tags: Type.Array(databaseTagSchema),
    description: Type.Optional(localizationTextSchema),
    skin: Type.String(),
    background: Type.String(),
    effect: Type.String(),
    particle: Type.String(),
    thumbnail: srlSchema,
    playData: srlSchema,
    watchData: srlSchema,
    previewData: srlSchema,
    tutorialData: srlSchema,
    rom: Type.Optional(srlSchema),
    configuration: srlSchema,
})

type _Tests = Expect<[SchemaToMatch<typeof databaseEngineItemSchema, DatabaseEngineItem>]>
