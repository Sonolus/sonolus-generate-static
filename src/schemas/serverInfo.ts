import { Type } from '@sinclair/typebox'
import { DatabaseServerInfo } from '@sonolus/core'
import { Expect } from '../utils/test'
import { localizationTextSchema } from './localizationText'
import { srlSchema } from './srl'
import { SchemaToMatch } from './test'

export const databaseServerInfoSchema = Type.Object({
    title: localizationTextSchema,
    description: Type.Optional(localizationTextSchema),
    banner: Type.Optional(srlSchema),
})

type _Tests = Expect<[SchemaToMatch<typeof databaseServerInfoSchema, DatabaseServerInfo>]>
