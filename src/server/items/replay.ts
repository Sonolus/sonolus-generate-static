import { DatabaseReplayItem, ReplayItem } from '@sonolus/core'
import { getByName } from '../database.js'
import { toTags } from '../tag.js'
import { ToItem } from './item.js'
import { toLevelItem } from './level.js'

export const toReplayItem: ToItem<DatabaseReplayItem, ReplayItem> = (sonolus, item) => ({
    name: item.name,
    source: sonolus.address,
    version: item.version,
    title: sonolus.localize(item.title),
    subtitle: sonolus.localize(item.subtitle),
    author: sonolus.localize(item.author),
    tags: toTags(sonolus.localize, item.tags),
    level: toLevelItem(
        sonolus,
        getByName(sonolus.db.levels, item.level, `Replay/${item.name}`, '/level'),
    ),
    data: item.data,
    configuration: item.configuration,
})
