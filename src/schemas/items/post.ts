import { Type } from '@sinclair/typebox'
import { DatabasePostItem } from '@sonolus/core'
import { Expect } from '../../utils/test'
import { localizationTextSchema } from '../localizationText'
import { srlSchema } from '../srl'
import { databaseTagSchema } from '../tag'
import { SchemaToMatch } from '../test'

export const databasePostItemSchema = Type.Object({
    name: Type.String(),
    version: Type.Literal(1),
    title: localizationTextSchema,
    time: Type.Number(),
    author: localizationTextSchema,
    tags: Type.Array(databaseTagSchema),
    description: localizationTextSchema,
    thumbnail: Type.Optional(srlSchema),
})

type _Tests = Expect<[SchemaToMatch<typeof databasePostItemSchema, DatabasePostItem>]>
