import { useAtom } from "jotai"
import { $entities, $game, $map } from "./state/state"

import { Canvas } from "@react-three/fiber"
import Map from "./components/Map/Map"
import { Perf } from "r3f-perf"
import { OrbitControls } from "@react-three/drei"
import "./styles.css"
import Entities from "./components/Entity/Entities"

function App() {
  const [game] = useAtom($game)
  const [map] = useAtom($map)
  const [entities] = useAtom($entities)
  console.log(entities)

  if (!game) {
    // Dusk only shows your game after an onChange() so no need for loading screen
    return
  }

  return (
    <Canvas>
      {/* <Perf position="top-left" /> */}
      <OrbitControls makeDefault />
      <pointLight />
      <ambientLight />

      <Map map={map} />
      <Entities entities={entities} />
    </Canvas>
  )
}

export default App
