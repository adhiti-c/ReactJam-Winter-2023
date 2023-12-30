import './App.css'
import Game from './components/game'
import { useEffect, useState } from 'react';
import { GameState } from './logic_v2/types';


function App() {

  const [game, setGame] = useState<GameState>()
  useEffect(() => {
    Rune.initClient({
      onChange: ({ game, yourPlayerId }) => {
        setGame(game)
      },
    })
  }, [])

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Game game={game} />
    </div>
  )

  /*  const [count, setCount] = useState(0)
  
  
  
    return (
      <>
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://developers.rune.ai" target="_blank">
            <img src={reactLogo} className="logo rune" alt="Rune logo" />
          </a>
        </div>
        <h1>Vite + Rune</h1>
        <div className="card">
          <button onClick={() => Rune.actions.increment({ amount: 1 })}>
            count is {game.count}
          </button>
          <p>
            Edit <code>src/App.tsx</code> or <code>src/logic.ts</code> and save to
            test HMR
          </p>
        </div>
        <p className="read-the-docs">
          Click on the Vite and Rune logos to learn more
        </p>
        <Game />
      </>
    )*/
}

export default App
