import { DatabaseTag, Tag } from 'sonolus-core'
import { Localize } from './localization'

export const toTags = (localize: Localize, tags: DatabaseTag[]) =>
    tags.map((tag) => toTag(localize, tag))

const toTag = (localize: Localize, tag: DatabaseTag): Tag => ({
    title: localize(tag.title),
    icon: tag.icon,
})
