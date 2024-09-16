import { AnyEntity } from "../../types/game-types"
import { Player } from "./Player"

export const Entity = ({ entity }: { entity: AnyEntity }) => {
  // ** global state **

  // ** local state ** //

  // ** local vars ** //

  // ** handlers ** //
  switch (entity.type) {
    case "player":
      return <Player entity={entity} />
    default:
      return null
  }
}
