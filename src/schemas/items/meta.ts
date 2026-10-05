import Type, { StaticDecode } from 'typebox'

import { localizationTextSchema } from '../localizationText.js'

export const metaSchema = Type.Optional(
    Type.Object({
        sections: Type.Optional(
            Type.Array(
                Type.Object({
                    title: localizationTextSchema,
                    icon: Type.Optional(Type.String()),
                    description: Type.Optional(localizationTextSchema),
                    help: Type.Optional(localizationTextSchema),
                    items: Type.Array(Type.String()),
                }),
            ),
        ),
    }),
)

export type ItemMeta = StaticDecode<typeof metaSchema>
