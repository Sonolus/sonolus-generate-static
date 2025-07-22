import { Type } from '@sinclair/typebox'
import { DatabaseEngineItem } from '@sonolus/core'
import { Expect } from '../../utils/test.js'
import { localizationTextSchema } from '../localizationText.js'
import { srlSchema } from '../srl.js'
import { databaseTagSchema } from '../tag.js'
import { SchemaToMatch } from '../test.js'

export const databaseEngineItemSchema = Type.Object({
    name: Type.String(),
    version: Type.Literal(13),
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
