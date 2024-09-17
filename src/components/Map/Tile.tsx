import { merge } from "lodash"
import { Tile as TileType, VelocityPosition } from "../../types/game-types"
import { useAtom } from "jotai"

export const Tile = ({ tile }: { tile: TileType }) => {
  // ** global state ** //

  // ** local state ** //

  // ** local vars ** //
  const { id: tileId, type, position } = tile

  // ** handlers ** //

  return (
    <mesh
      position={[position.x, position.y, 0]}
      onClick={() => Dusk.actions.playerMove(position)}
    >
      <planeGeometry />
      <meshStandardMaterial color={type === "floor" ? "green" : "black"} />
    </mesh>
  )
}
