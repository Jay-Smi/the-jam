import { atom, createStore } from "jotai"
import { PlayerId, Players } from "dusk-games-sdk"
import { GameSetupState, GameState } from "../types/game-types"

// Initialize the Jotai store
export const store = createStore()

// Main game state atom
export const $state = atom<GameSetupState>({
  game: {
    status: "gettingReady",
    entities: [],
    map: [],
    discoveredRooms: [],
  },
  allPlayerIds: [],
  yourPlayerId: undefined,
})

export const $allPlayerIds = atom((get) => get($state).allPlayerIds)

export const $game = atom((get) => get($state).game)

export const $entities = atom((get) => get($game).entities)

export const $playerEntities = atom((get) =>
  get($game).entities.filter((entity) => entity.type === "player")
)

export const $status = atom((get) => get($game).status)

export const $activeRooms = atom((get) => {
  const playerEntities = get($playerEntities)

  const activeRoomIds = new Set<string>()

  playerEntities.forEach((player) => {
    activeRoomIds.add(player.position.roomId)
  })

  return Array.from(activeRoomIds)
})

export const $discoveredRooms = atom((get) => get($game).discoveredRooms)

export const $yourPlayerId = atom((get) => get($state).yourPlayerId)

export const $map = atom((get) => get($game).map)

export const $entityPositions = atom((get) =>
  get($game).entities.map((entity) => entity.position)
)

export const $tilesInActiveRooms = atom((get) => {
  const game = get($game)
  const activeRooms = get($activeRooms)
  return game.map
    .filter((room) => activeRooms.includes(room.id))
    .flatMap((room) => room.tiles)
})
