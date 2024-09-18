import { Canvas, useFrame, useThree } from "@react-three/fiber"
import Map from "./components/Map/Map"
import { OrbitControls } from "@react-three/drei"
import "./styles.css"
import PlayerEntities from "./components/Entity/PlayerEntities"
import { useEffect, useRef } from "react"
import { useGameStore } from "./state/useGameStore"
import { Perf } from "r3f-perf"
import { Vector3 } from "three"
import * as THREE from "three"

function Controls({ targetPosition }: { targetPosition: THREE.Vector3 }) {
  const { camera } = useThree()

  useFrame(() => {
    // Smooth camera follow effect using lerp
    camera.position.lerp(
      new THREE.Vector3(targetPosition.x + 2, targetPosition.y - 5, 10),
      0.1
    )
    // Make the camera look at the player
    camera.lookAt(targetPosition)
  })

  return null // No JSX needed, just controlling the camera
}

function App() {
  // ** global state ** //
  const setStore = useGameStore((state) => state.setStore)
  const playerEntities = useGameStore((state) => state.game.playerEntities)
  const map = useGameStore((state) => state.game.map)
  const yourPlayerId = useGameStore((state) => state.yourPlayerId)
  const yourPlayer = playerEntities.find((entity) => entity.id === yourPlayerId)

  // Default to origin if no player is found
  const { x, y } = yourPlayer?.position || { x: 0, y: 0 }

  // Target player position as a THREE.Vector3
  const targetPosition = new THREE.Vector3(x, y, 0)

  // ** effects ** //
  useEffect(() => {
    Rune.initClient({
      onChange: setStore,
    })
  }, [setStore])

  if (!map.length) {
    return null // No need for loading screen
  }

  return (
    <Canvas camera={{ position: [x + 2, y - 5, 10] }}>
      <pointLight />
      <ambientLight />
      <OrbitControls makeDefault />

      {/* Render the map and player entities */}
      <Map map={map} />
      <PlayerEntities entities={playerEntities} />

      {/* Camera controls to follow the player */}
      <Controls targetPosition={targetPosition} />
    </Canvas>
  )
}

export default App
