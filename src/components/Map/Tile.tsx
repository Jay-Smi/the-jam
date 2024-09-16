import { useAtom } from "jotai"
import { Tile as TileType } from "../../types/game-types"
import { $entities } from "../../state/state"

export const Tile = ({ tile }: { tile: TileType }) => {
  // ** global state ** //

  // ** local state ** //

  // ** local vars ** //
  const { id: tileId, type, position } = tile

  // ** handlers ** //
  return (
    <mesh position={[position.x, position.y, 0]}>
      <planeGeometry />
      <meshStandardMaterial color={type === "floor" ? "green" : "black"} />
    </mesh>
  )
}
