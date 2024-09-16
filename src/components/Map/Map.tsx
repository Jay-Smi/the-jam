import { memo } from "react"
import { Room as RoomType } from "../../types/game-types"
import Room from "./Room"

const Map = ({ map }: { map: RoomType[] }) => {
  // ** global state **

  // ** local state ** //

  // ** local vars ** //

  // ** handlers ** //
  return (
    <group>
      {map.map((room, i) => (
        <Room key={i} room={room} />
      ))}
    </group>
  )
}

export default memo(Map)
