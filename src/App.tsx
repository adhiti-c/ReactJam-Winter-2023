import "./App.css";
import Game from "./components/game";
import { useEffect, useState } from "react";
import { GameState } from "./logic_v2/types";
import { Player, Players } from "rune-games-sdk";

function App() {
  const [game, setGame] = useState<GameState>();
  const [player, setClientPlayer] = useState<Player>();
  const [players, setAllPlayers] = useState<Players>();

  useEffect(() => {
    Rune.initClient({
      onChange: ({ game, yourPlayerId, players }) => {
        setGame(game);
        // get the player from the playerId and set it as a state
        if (yourPlayerId) {
          setClientPlayer(players[yourPlayerId]);
        }
        setAllPlayers(players);
      },
    });
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {
        !game || !player || !players ?
          <div>
            Loading...
          </div>
          :
          <Game game={game} player={player} players={players} />
      }
    </div>
  );
}

export default App;
