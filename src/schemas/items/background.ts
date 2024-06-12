import { Type } from '@sinclair/typebox'
import { DatabaseBackgroundItem } from '@sonolus/core'
import { Expect } from '../../utils/test'
import { localizationTextSchema } from '../localizationText'
import { srlSchema } from '../srl'
import { databaseTagSchema } from '../tag'
import { SchemaToMatch } from '../test'

export const databaseBackgroundItemSchema = Type.Object({
    name: Type.String(),
    version: Type.Literal(2),
    title: localizationTextSchema,
    subtitle: localizationTextSchema,
    author: localizationTextSchema,
    tags: Type.Array(databaseTagSchema),
    description: localizationTextSchema,
    thumbnail: srlSchema,
    data: srlSchema,
    image: srlSchema,
    configuration: srlSchema,
})

type _Tests = Expect<[SchemaToMatch<typeof databaseBackgroundItemSchema, DatabaseBackgroundItem>]>
