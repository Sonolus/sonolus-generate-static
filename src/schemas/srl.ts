import { ResourceType } from 'sonolus-core'
import { z } from 'zod'

export function getSRLSchema<T extends ResourceType>(type: T) {
    return z.object({
        type: z.literal(type),
        hash: z.string(),
        url: z.string(),
    })
}
