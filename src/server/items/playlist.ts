import { DatabasePlaylistItem, PlaylistItem } from '@sonolus/core'
import { getByName } from '../database.js'
import { toTags } from '../tag.js'
import { ToItem } from './item.js'
import { toLevelItem } from './level.js'

export const toPlaylistItem: ToItem<DatabasePlaylistItem, PlaylistItem> = (sonolus, item) => ({
    name: item.name,
    source: sonolus.address,
    version: item.version,
    title: sonolus.localize(item.title),
    subtitle: sonolus.localize(item.subtitle),
    author: sonolus.localize(item.author),
    tags: toTags(sonolus.localize, item.tags),
    levels: item.levels.map((level, index) =>
        toLevelItem(
            sonolus,
            getByName(sonolus.db.levels, level, `Playlist/${item.name}`, `/levels/${index}`),
        ),
    ),
    thumbnail: item.thumbnail,
})
