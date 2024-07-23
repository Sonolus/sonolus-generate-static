import { Type } from '@sinclair/typebox'
import { DatabaseEffectItem } from '@sonolus/core'
import { Expect } from '../../utils/test'
import { localizationTextSchema } from '../localizationText'
import { srlSchema } from '../srl'
import { databaseTagSchema } from '../tag'
import { SchemaToMatch } from '../test'

export const databaseEffectItemSchema = Type.Object({
    name: Type.String(),
    version: Type.Literal(5),
    title: localizationTextSchema,
    subtitle: localizationTextSchema,
    author: localizationTextSchema,
    tags: Type.Array(databaseTagSchema),
    description: Type.Optional(localizationTextSchema),
    thumbnail: srlSchema,
    data: srlSchema,
    audio: srlSchema,
})

type _Tests = Expect<[SchemaToMatch<typeof databaseEffectItemSchema, DatabaseEffectItem>]>
