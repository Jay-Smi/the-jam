import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import { Provider } from "jotai"
import { $state, store } from "./state/state.ts"
import { StrictMode } from "react"

Dusk.initClient({
  onChange: ({ game, yourPlayerId, allPlayerIds }) => {
    store.set($state, {
      game,
      allPlayerIds,
      yourPlayerId,
    })
  },
})

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
)
