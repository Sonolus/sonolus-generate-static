import { Database } from '@sonolus/core'
import { Localize } from './localization'

export type Sonolus = {
    db: Database
    address?: string
    localize: Localize
}
