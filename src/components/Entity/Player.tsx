import { Player as PlayerType } from "../../types/game-types"

export const Player = ({ entity }: { entity: PlayerType }) => {
  // ** global state **

  // ** local state ** //

  // ** local vars ** //

  // ** handlers ** //
  return (
    <mesh position={[entity.position.x, entity.position.y, 0]}>
      <sphereGeometry />
      <meshStandardMaterial color="blue" />
    </mesh>
  )
}
