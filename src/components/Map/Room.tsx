import { memo } from "react"
import { Room as RoomType } from "../../types/game-types"
import { Tile } from "./Tile"
import { ROOM_SIZE } from "../../constants/map-constants"

const Room = ({ room }: { room: RoomType }) => {
  // ** global state **

  // ** local state ** //

  // ** local vars ** //
  const { id: roomId, position, tiles, connectedRooms } = room
  console.log(position)

  // ** handlers ** //
  return (
    <group position={[position.x * ROOM_SIZE, position.y * ROOM_SIZE, 0]}>
      {tiles.map((row, i) =>
        row.map((tile, j) => <Tile key={i + j} tile={tile} />)
      )}
    </group>
  )
}

export default memo(Room)
