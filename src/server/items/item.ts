import { Sonolus } from '../sonolus.js'

export type ToItem<T, U> = (sonolus: Sonolus, item: T) => U
