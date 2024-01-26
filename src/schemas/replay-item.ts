import { z } from 'zod'
import { localizationTextSchema } from './localization-text'
import { getSRLSchema } from './srl'
import { databaseTagSchema } from './tag'

export const databaseReplayItemSchema = z.object({
    name: z.string(),
    version: z.literal(1),
    title: localizationTextSchema,
    subtitle: localizationTextSchema,
    author: localizationTextSchema,
    tags: z.array(databaseTagSchema),
    description: localizationTextSchema,
    level: z.string(),
    data: getSRLSchema('ReplayData'),
    configuration: getSRLSchema('ReplayConfiguration'),
})
