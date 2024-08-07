import { DatabasePlaylistItem, PlaylistItem } from '@sonolus/core'
import { getByName } from '../database'
import { toTags } from '../tag'
import { ToItem } from './item'
import { toLevelItem } from './level'

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
