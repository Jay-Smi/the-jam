import { useFrame } from "@react-three/fiber"
import { Player as PlayerType } from "../../types/game-types"
import { memo, useEffect, useRef, useState } from "react"
import { Mesh } from "three"
import { Text } from "@react-three/drei"
import { useGameStore } from "../../state/useGameStore"

const Player = ({ entity }: { entity: PlayerType }) => {
  const { position } = entity

  // ** global state ** //
  const yourPlayerId = useGameStore((state) => state.yourPlayerId)

  // ** local vars ** //
  const isYourPlayer = entity.id === yourPlayerId

  return (
    <mesh position={[position.x, position.y, 0]}>
      {isYourPlayer && (
        <perspectiveCamera position={[position.x, position.y, 0]} />
      )}
      <sphereGeometry />
      <meshStandardMaterial color="blue" />
    </mesh>
  )
}
export default memo(Player)
