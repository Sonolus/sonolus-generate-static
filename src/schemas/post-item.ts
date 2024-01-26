import { z } from 'zod'
import { localizationTextSchema } from './localization-text'
import { getSRLSchema } from './srl'
import { databaseTagSchema } from './tag'

export const databasePostItemSchema = z.object({
    name: z.string(),
    version: z.literal(1),
    title: localizationTextSchema,
    time: z.number(),
    author: localizationTextSchema,
    tags: z.array(databaseTagSchema),
    description: localizationTextSchema,
    thumbnail: getSRLSchema('PostThumbnail').optional(),
})
