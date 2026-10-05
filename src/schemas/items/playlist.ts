import { DatabasePlaylistItem } from '@sonolus/core'
import Type from 'typebox'

import { Expect } from '../../utils/test.js'
import { localizationTextSchema } from '../localizationText.js'
import { srlSchema } from '../srl.js'
import { databaseTagSchema } from '../tag.js'
import { SchemaToMatch } from '../test.js'
import { metaSchema } from './meta.js'

export const databasePlaylistItemSchema = Type.Object({
    name: Type.String(),
    version: Type.Literal(1),
    title: localizationTextSchema,
    subtitle: localizationTextSchema,
    author: localizationTextSchema,
    tags: Type.Array(databaseTagSchema),
    description: Type.Optional(localizationTextSchema),
    levels: Type.Array(Type.String()),
    thumbnail: Type.Optional(srlSchema),
    meta: metaSchema,
})

type _Tests = Expect<[SchemaToMatch<typeof databasePlaylistItemSchema, DatabasePlaylistItem>]>
