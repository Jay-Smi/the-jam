import { ROOM_SIZE } from "../constants/map-constants"
import { GameEntities, Map, Room, RoomTiles, Tile } from "../types/game-types"

export const genMap = (allPlayerIds: string[]): Map => {
  // generate a map with a single room, 16x16 tiles
  // room ids are just `room-${index}`
  // title ids are `room-${index}-tile-${index}`

  const roomId = "room-1"

  const tiles: RoomTiles = []

  for (let y = 0; y < ROOM_SIZE; y++) {
    const row = []
    for (let x = 0; x < ROOM_SIZE; x++) {
      const tileId = `${roomId}-tile-${y * ROOM_SIZE + x}`

      const tile: Tile = {
        id: tileId,
        type: "floor",
        position: { x, y, roomId },
      }

      row.push(tile)
    }
    tiles.push(row)
  }

  const room: Room = {
    id: roomId,
    position: { x: 0, y: 0 },
    tiles,
    connectedRooms: [],
  }

  const map: Map = [room]

  return map
}

export const genEntities = (allPlayerIds: string[]) => {
  const entities: GameEntities = {
    npcEntities: [],
    envEntities: [],
    playerEntities: allPlayerIds.map((id, i) => ({
      id,
      type: "player",
      position: {
        x: i,
        y: 0,
        roomId: "room-1",
        direction: "N",
        speed: 1,
        movingTo: null,
      },
      status: "pending",
      health: 100,
      inventory: [],
      stats: {
        strength: 10,
        agility: 10,
        stamina: 10,
      },
    })),
  }

  return entities
}
