import "./App.css";
import Game from "./components/game";
import { useEffect, useState, useContext, createContext } from "react";
import { GameState } from "./logic_v2/types";
import { PlayerId } from "rune-games-sdk";

export interface GameContextType {
  game: GameState | undefined, playerId: PlayerId | undefined
}

function App() {
  const [game, setGame] = useState<GameContextType>();
  const GameContext = createContext<GameContextType>({
    game: undefined,
    playerId: undefined
  });

  useEffect(() => {
    Rune.initClient({
      onChange: ({ game, yourPlayerId, players }) => {
        setGame(
          {
            game: game,
            playerId: yourPlayerId
          }
        );
      },
    });
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {
        !game || !(game.game) ?
          <div>
            Loading...
          </div>
          :
          <GameContext.Provider value={game}>
            <Game game={game.game} />
          </GameContext.Provider>
      }
    </div>
  );
}

export default App;
