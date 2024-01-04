import "./App.css";
import Game from "./components/game";
import { useEffect, useState } from "react";
import { GameState } from "./logic_v2/types";
import { PlayerId } from "rune-games-sdk";

function App() {
  const [game, setGame] = useState<GameState>();
  const [playerId, setPlayerId] = useState<PlayerId>();

  useEffect(() => {
    Rune.initClient({
      onChange: ({ game, yourPlayerId, players }) => {
        setGame(game);
        setPlayerId(yourPlayerId);
      },
    });
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {
        !game ?
          <div>
            Loading...
          </div>
          :
          <Game game={game} />
      }
    </div>
  );
}

export default App;
