import { clone, cloneDeep, merge } from "lodash"
import { ROOM_SIZE } from "../constants/map-constants"
import {
  GameEntities,
  GameState,
  Map,
  Position,
  PositionBase,
  Room,
  RoomTiles,
  Tile,
  VelocityPosition,
} from "../types/game-types"

export const genMap = (): Map => {
  // generate a map with a single room, 16x16 tiles
  // room ids are just `room-${index}`
  // title ids are `room-${index}-tile-${index}`

  const rooms = Array.from({ length: 9 }, (_, i) => genRoom(i))

  const map: Map = rooms

  return map
}

const genRoom = (index: number) => {
  const tiles: RoomTiles = []
  const id = `room-${index}`

  for (let y = 0; y < ROOM_SIZE; y++) {
    const row = []
    for (let x = 0; x < ROOM_SIZE; x++) {
      const tileId = `${id}-tile-${y * ROOM_SIZE + x}`

      const type =
        x === 0 || x === ROOM_SIZE - 1 || y === 0 || y === ROOM_SIZE - 1
          ? "wall"
          : "floor"

      const tile: Tile = {
        id,
        type,
        position: { x, y, roomId: tileId },
      }

      row.push(tile)
    }
    tiles.push(row)
  }

  // room 0 starts in center, x: 0, y: 0
  // room 1 is North at x: 0, y: 1
  // room 2 is East at x: 1, y: 0
  // room 3 is South at x: 0, y: -1
  // room 4 is West at x: -1, y: 0
  // room 5 is NorthEast at x: 1, y: 1
  // room 6 is SouthEast at x: 1, y: -1
  // room 7 is SouthWest at x: -1, y: -1
  // room 8 is NorthWest at x: -1, y

  const position: PositionBase =
    index === 0
      ? { x: 0, y: 0 }
      : index === 1
        ? { x: 0, y: 1 }
        : index === 2
          ? { x: 1, y: 0 }
          : index === 3
            ? { x: 0, y: -1 }
            : index === 4
              ? { x: -1, y: 0 }
              : index === 5
                ? { x: 1, y: 1 }
                : index === 6
                  ? { x: 1, y: -1 }
                  : index === 7
                    ? { x: -1, y: -1 }
                    : { x: -1, y: 1 }

  const room: Room = {
    id,
    position,
    tiles,
    connectedRooms: [],
  }

  return room
}

export const genEntities = (allPlayerIds: string[]) => {
  const entities: GameEntities = {
    npcEntities: [],
    envEntities: [],
    playerEntities: allPlayerIds.map((id, i) => {
      //  pos:{x,y} should be the center 4 tiles of the room rotating clockwise by i
      const pos: PositionBase =
        i === 0
          ? { x: 7, y: 7 }
          : i === 1
            ? { x: 8, y: 7 }
            : i === 2
              ? { x: 8, y: 8 }
              : { x: 7, y: 8 }

      return {
        id,
        type: "player",
        position: {
          roomId: "room-1",
          direction: "N",
          speed: 1,
          movingTo: null,
          ...pos,
        },
        status: "pending",
        health: 100,
        inventory: [],
        stats: {
          strength: 10,
          agility: 10,
          stamina: 10,
        },
      }
    }),
  }

  return entities
}

export function updatePlayers(game: GameState) {
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

export function aStarPathfinding(
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
        neighborTile.type === "obstacle" ||
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
