import type { RuneClient } from "rune-sdk"
import { GameActions, GameState } from "./types/game-types"
import { genEntities, genMap, updatePlayers } from "./utils/game-utils"

declare global {
  const Rune: RuneClient<GameState, GameActions>
}

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  landscape: true,
  updatesPerSecond: 3,
  setup: (allPlayerIds) => {
    const map = genMap()

    const entities = genEntities(allPlayerIds)

    return {
      status: "gettingReady",
      map,
      discoveredRooms: [],
      ...entities,
    }
  },
  actions: {
    playerMove: (payload, { game, playerId }) => {
      const player = game.playerEntities.find(
        (entity) => entity.id === playerId
      )

      if (!player) {
        throw Rune.invalidAction()
      }

      player.position.movingTo = payload
    },
  },

  update: ({ game }) => {
    updatePlayers(game)
  },
})
