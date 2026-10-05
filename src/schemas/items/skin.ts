import { DatabaseSkinItem } from '@sonolus/core'
import Type from 'typebox'

import { Expect } from '../../utils/test.js'
import { localizationTextSchema } from '../localizationText.js'
import { srlSchema } from '../srl.js'
import { databaseTagSchema } from '../tag.js'
import { SchemaToMatch } from '../test.js'
import { metaSchema } from './meta.js'

export const databaseSkinItemSchema = Type.Object({
    name: Type.String(),
    version: Type.Literal(4),
    title: localizationTextSchema,
    subtitle: localizationTextSchema,
    author: localizationTextSchema,
    tags: Type.Array(databaseTagSchema),
    description: Type.Optional(localizationTextSchema),
    thumbnail: srlSchema,
    data: srlSchema,
    texture: srlSchema,
    meta: metaSchema,
})

type _Tests = Expect<[SchemaToMatch<typeof databaseSkinItemSchema, DatabaseSkinItem>]>
