import { GameSetupState } from "../types/game-types"
import { create } from "zustand"
import { immer } from "zustand/middleware/immer"
export type StoreActions = {
  setStore: (state: GameSetupState) => void
}

export const useGameStore = create<GameSetupState & StoreActions>()(
  immer((set) => ({
    game: {
      status: "gettingReady",
      playerEntities: [],
      npcEntities: [],
      envEntities: [],
      map: [],
      discoveredRooms: [],
    },
    allPlayerIds: [],
    yourPlayerId: undefined,

    setStore: (state) => set(state),
  }))
)
