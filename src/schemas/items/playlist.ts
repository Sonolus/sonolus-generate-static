import { Type } from '@sinclair/typebox'
import { DatabasePlaylistItem } from '@sonolus/core'
import { Expect } from '../../utils/test'
import { localizationTextSchema } from '../localizationText'
import { srlSchema } from '../srl'
import { databaseTagSchema } from '../tag'
import { SchemaToMatch } from '../test'

export const databasePlaylistItemSchema = Type.Object({
    name: Type.String(),
    version: Type.Literal(1),
    title: localizationTextSchema,
    subtitle: localizationTextSchema,
    author: localizationTextSchema,
    tags: Type.Array(databaseTagSchema),
    description: localizationTextSchema,
    levels: Type.Array(Type.String()),
    thumbnail: Type.Optional(srlSchema),
})

type _Tests = Expect<[SchemaToMatch<typeof databasePlaylistItemSchema, DatabasePlaylistItem>]>
