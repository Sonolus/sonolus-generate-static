import { Type } from '@sinclair/typebox'
import { DatabaseParticleItem } from '@sonolus/core'
import { Expect } from '../../utils/test'
import { localizationTextSchema } from '../localizationText'
import { srlSchema } from '../srl'
import { databaseTagSchema } from '../tag'
import { SchemaToMatch } from '../test'

export const databaseParticleItemSchema = Type.Object({
    name: Type.String(),
    version: Type.Literal(3),
    title: localizationTextSchema,
    subtitle: localizationTextSchema,
    author: localizationTextSchema,
    tags: Type.Array(databaseTagSchema),
    description: localizationTextSchema,
    thumbnail: srlSchema,
    data: srlSchema,
    texture: srlSchema,
})

type _Tests = Expect<[SchemaToMatch<typeof databaseParticleItemSchema, DatabaseParticleItem>]>
