import { Static, Type } from '@sinclair/typebox'

export const orderingSchema = Type.Partial(
    Type.Object({
        posts: Type.Array(Type.String()),
        playlists: Type.Array(Type.String()),
        levels: Type.Array(Type.String()),
        skins: Type.Array(Type.String()),
        backgrounds: Type.Array(Type.String()),
        effects: Type.Array(Type.String()),
        particles: Type.Array(Type.String()),
        engines: Type.Array(Type.String()),
        replays: Type.Array(Type.String()),
    }),
)

export type Ordering = Static<typeof orderingSchema>
