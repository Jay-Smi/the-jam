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
      {tiles.map((row, i) =>
        row.map((tile, j) => <Tile key={i + j} tile={tile} />)
      )}
    </group>
  )
}

export default memo(Room)
