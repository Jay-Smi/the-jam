import { memo } from "react"
import { AnyEntity } from "../../types/game-types"
import { Entity } from "./Entity"

const Entities = ({ entities }: { entities: AnyEntity[] }) =>
  entities.map((entity, i) => {
    return <Entity entity={entity} key={i} />
  })

export default memo(Entities)
