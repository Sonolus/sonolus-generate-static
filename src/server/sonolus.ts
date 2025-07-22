import { Database } from '@sonolus/core'
import { Localize } from './localization.js'

export type Sonolus = {
    db: Database
    address?: string
    localize: Localize
}
