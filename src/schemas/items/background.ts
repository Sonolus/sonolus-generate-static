import { Type } from '@sinclair/typebox'
import { DatabaseBackgroundItem } from '@sonolus/core'
import { Expect } from '../../utils/test.js'
import { localizationTextSchema } from '../localizationText.js'
import { srlSchema } from '../srl.js'
import { databaseTagSchema } from '../tag.js'
import { SchemaToMatch } from '../test.js'

export const databaseBackgroundItemSchema = Type.Object({
    name: Type.String(),
    version: Type.Literal(2),
    title: localizationTextSchema,
    subtitle: localizationTextSchema,
    author: localizationTextSchema,
    tags: Type.Array(databaseTagSchema),
    description: Type.Optional(localizationTextSchema),
    thumbnail: srlSchema,
    data: srlSchema,
    image: srlSchema,
    configuration: srlSchema,
})

type _Tests = Expect<[SchemaToMatch<typeof databaseBackgroundItemSchema, DatabaseBackgroundItem>]>
