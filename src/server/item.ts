import { Sonolus } from './sonolus'

export type ToItem<T, U> = (sonolus: Sonolus, item: T) => U
