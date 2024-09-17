import type { DuskClient } from "dusk-games-sdk/multiplayer"
import {
  GameActions,
  GameState,
  Position,
  Room,
  Tile,
  VelocityPosition,
} from "./types/game-types"
import { genEntities, genMap } from "./utils/game-utils"
import { merge } from "lodash"

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
      console.log("playerMove", player, payload)

      if (!player) {
        throw Dusk.invalidAction()
      }

      player.position.movingTo = payload
    },
  },
  updatesPerSecond: 1,
  update: ({ game, allPlayerIds }) => {
    updatePlayers(game, allPlayerIds)
  },
})

function updatePlayers(game: GameState, allPlayerIds: string[]) {
  // iterate game.playerEntities check their position.movingTo
  // if it's not null, move them 1 tile towards that position

  for (const player of game.playerEntities) {
    if (!player.position.movingTo) {
      continue
    }

    const path = aStarPathfinding(
      player.position,
      player.position.movingTo,
      game.map[0]
    )

    if (path.length > 0) {
      player.position = merge(player.position, path[1] as VelocityPosition)
    } else {
      player.position.movingTo = null
    }
  }
}

type AStarItem = {
  position: { x: number; y: number }
  g: number
  h: number
  f: number
  parent: AStarItem | null
}

function aStarPathfinding(
  start: VelocityPosition | Position,
  end: Position,
  room: Room
) {
  const directions = [
    { x: 0, y: 1 }, // N
    { x: 0, y: -1 }, // S
    { x: 1, y: 0 }, // E
    { x: -1, y: 0 }, // W
    { x: 1, y: 1 }, // NE
    { x: 1, y: -1 }, // SE
    { x: -1, y: 1 }, // NW
    { x: -1, y: -1 }, // SW
  ]

  function heuristic(
    a: VelocityPosition | Position,
    b: VelocityPosition | Position
  ) {
    // Manhattan distance
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y)
  }

  const openList: AStarItem[] = []
  const closedList = new Set()

  openList.push({
    position: start,
    g: 0, // cost from start to current node
    h: heuristic(start, end), // estimated cost from current node to end
    f: 0, // total cost (g + h)
    parent: null,
  })

  while (openList.length > 0) {
    // Sort by total cost (f)
    openList.sort((a, b) => a.f - b.f)

    // Get the node with the lowest f score
    const current: AStarItem | null = openList.shift()!

    // If the current node is the end, we found the path
    if (current.position.x === end.x && current.position.y === end.y) {
      const path = []
      let node: AStarItem | null = current
      while (node) {
        path.push(node.position)
        node = node.parent
      }
      return path.reverse()
    }

    // Add current node to the closed list
    closedList.add(`${current.position.x},${current.position.y}`)

    // Explore neighbors
    for (const direction of directions) {
      const neighborX = current.position.x + direction.x
      const neighborY = current.position.y + direction.y

      if (
        neighborX < 0 ||
        neighborX >= 16 ||
        neighborY < 0 ||
        neighborY >= 16
      ) {
        continue // Skip out-of-bound tiles
      }

      const neighborTile: Tile = room.tiles[neighborY][neighborX]
      if (
        neighborTile.type === "wall" ||
        closedList.has(`${neighborX},${neighborY}`)
      ) {
        continue // Skip walls or tiles in the closed list
      }

      const gScore = current.g + 1 // Moving to the neighbor costs 1

      const existingOpen = openList.find(
        (item) => item.position.x === neighborX && item.position.y === neighborY
      )

      if (!existingOpen) {
        const neighborNode = {
          position: { x: neighborX, y: neighborY },
          g: gScore,
          h: heuristic({ x: neighborX, y: neighborY } as Position, end),
          f:
            gScore + heuristic({ x: neighborX, y: neighborY } as Position, end),
          parent: current,
        }
        openList.push(neighborNode)
      } else if (gScore < existingOpen.g) {
        // If found a shorter path to neighbor
        existingOpen.g = gScore
        existingOpen.f = gScore + existingOpen.h
        existingOpen.parent = current
      }
    }
  }

  // Return empty path if no valid path found
  return []
}
