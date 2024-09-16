import { ROOM_SIZE } from "../constants/map-constants"
import { AnyEntity, Map, Room, RoomTiles } from "../types/game-types"

export const genMap = (allPlayerIds: string[]): Map => {
  // generate a map with a single room, 16x16 tiles
  // room ids are just `room-${index}`
  // title ids are `room-${index}-tile-${index}`

  const roomId = "room-1"

  const tiles: RoomTiles = []

  for (let y = 0; y < ROOM_SIZE; y++) {
    for (let x = 0; x < ROOM_SIZE; x++) {
      const tileId = `${roomId}-tile-${y * ROOM_SIZE + x}`
      tiles.push({
        id: tileId,
        type: "floor",
        position: { x, y, roomId },
      })
    }
  }

  const tilesWithPlayers = tiles.map((tile, i) => {
    if (i < allPlayerIds.length) {
      return {
        ...tile,
        entityId: allPlayerIds[i],
      }
    }
    return tile
  })

  const room: Room = {
    id: roomId,
    position: { x: 0, y: 0 },
    tiles: tilesWithPlayers,
    connectedRooms: [],
  }

  const map: Map = [room]

  return map
}

export const genEntities = (allPlayerIds: string[]): AnyEntity[] => {
  return allPlayerIds.map((id, i) => ({
    id,
    type: "player",
    position: { x: i, y: 0, roomId: "room-1", direction: "N", speed: 0 },
    status: "pending",
    health: 100,
    inventory: [],
    stats: {
      strength: 10,
      agility: 10,
      stamina: 10,
    },
  }))
}
