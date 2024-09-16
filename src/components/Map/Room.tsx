import { memo } from "react"
import { Room as RoomType } from "../../types/game-types"
import { Tile } from "./Tile"

const Room = ({ room }: { room: RoomType }) => {
  // ** global state **

  // ** local state ** //

  // ** local vars ** //
  const { id: roomId, position, tiles, connectedRooms } = room

  // ** handlers ** //
  return (
    <group>
      {tiles.map((tile, i) => (
        <Tile key={i} tile={tile} />
      ))}
    </group>
  )
}

export default memo(Room)
