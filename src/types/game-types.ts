import type { PlayerId } from "dusk-games-sdk/multiplayer"

export type GameSetupState = {
  yourPlayerId: PlayerId | undefined
  allPlayerIds: PlayerId[]
  game: GameState
}

export type GameStatus = "gettingReady" | "countdown" | "playing" | "gameOver"
export type LivingEntityStatus = "pending" | "alive" | "dead"
export type Direction = "N" | "E" | "S" | "W" | "NE" | "SE" | "SW" | "NW"

type PositionBase = {
  x: number
  y: number
}

type Position = PositionBase & {
  roomId: string
}

type VelocityPosition = Position & {
  direction: Direction
  speed: 0 | 1 | 2
}

type EntityType = "player" | "monster" | "object"

type Entity = {
  id: string
  type: EntityType
  position: VelocityPosition
}

type LivingEntity = Entity & {
  status: LivingEntityStatus
  health: number
  inventory: string[]
  stats: {
    strength: number
    agility: number
    stamina: number
  }
}

type EnvEntity = Entity & {
  blocksPassThrough: boolean
  blocksProjectiles: boolean
}

export type Player = LivingEntity & {
  type: "player"
}

type Monster = LivingEntity & {
  type: "monster"
}

type Object = EnvEntity & {
  type: "object"
}

export type AnyEntity = Player | Monster | Object

export type Tile = {
  id: string
  type: "wall" | "floor"
  position: Position
}

export type RoomTiles = Tile[]

export type Room = {
  id: string
  position: PositionBase
  tiles: RoomTiles
  connectedRooms: string[]
}

export type Map = Room[]

export type GameState = {
  status: GameStatus
  entities: AnyEntity[]
  map: Map
  discoveredRooms: string[]
}

export type GameActions = {}
