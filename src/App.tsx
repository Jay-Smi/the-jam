import { Canvas } from "@react-three/fiber"
import Map from "./components/Map/Map"
import { OrbitControls, Stats } from "@react-three/drei"
import "./styles.css"
import PlayerEntities from "./components/Entity/PlayerEntities"
import { useEffect } from "react"
import { useGameStore } from "./state/useGameStore"

function App() {
  // ** global state ** //
  const setStore = useGameStore((state) => state.setStore)
  const { map, playerEntities } = useGameStore((state) => state.game)

  // ** effects ** //

  useEffect(() => {
    Dusk.initClient({
      onChange: (state) => {
        console.log(state)

        setStore(state)
      },
    })
  }, [setStore])

  if (!map.length) {
    // Dusk only shows your game after an onChange() so no need for loading screen
    return
  }

  return (
    <Canvas>
      <Stats />
      <OrbitControls makeDefault />
      <pointLight />
      <ambientLight />

      <Map map={map} />
      <PlayerEntities entities={playerEntities} />
    </Canvas>
  )
}

export default App
