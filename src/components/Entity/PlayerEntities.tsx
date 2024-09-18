import { memo } from "react"
import { AnyEntity } from "../../types/game-types"
import Entity from "./Entity"

const PlayerEntities = ({ entities }: { entities: AnyEntity[] }) =>
  entities.map((entity, i) => {
    return i === 0 ? <Entity entity={entity} key={i} /> : null
  })

export default memo(PlayerEntities)
