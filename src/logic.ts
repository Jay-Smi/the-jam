import type { DuskClient } from "dusk-games-sdk/multiplayer"
import { GameActions, GameState } from "./types/game-types"
import { genEntities, genMap } from "./utils/game-utils"

declare global {
  const Dusk: DuskClient<GameState, GameActions>
}

Dusk.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  landscape: true,
  setup: (allPlayerIds) => {
    const map = genMap(allPlayerIds)

    const entities = genEntities(allPlayerIds)

    return {
      status: "gettingReady",
      entities,
      map,
      discoveredRooms: [],
    }
  },
  actions: {},
})
