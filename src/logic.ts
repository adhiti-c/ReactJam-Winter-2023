import { StartTimeLeftMilliseconds } from "./logic_v2/logicConfig";
import { Player, GameState } from "./logic_v2/types";

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  setup: (allPlayerIds): GameState => {

    // create all players
    const players: Record<string, Player> = {};
    for (const playerId of allPlayerIds) {
      players[playerId] = {
        id: playerId,
        inventory: [null],
        hasPlaced: false
      }
    }

    // create the game state
    const game: GameState = {
      lastCountdown: 0,
      timeLeft: StartTimeLeftMilliseconds,
      phase: "playing",
      players: players,
      cake: [],
      score: 0,
      // currentRecipe: {
      //   // basic cake base
      // },
    }

    return game;

  },
  actions: {
    // increment: ({ amount }, { game }) => {
    //   game.count += amount
    // },
  },
  update: ({ game }) => {
    // check if the time is gone
    if (game.timeLeft < 0) {
      // set the phase to be loss
      game.phase = "loss";
      game.timeLeft = 0;
      // Rune.gameOver(); // TODO: implement this later
    } else {
      if (game.phase === "playing") {
        const timeDiff = Rune.gameTime() - game.lastCountdown;
        // if we counting down, count down every second
        if (timeDiff >= 1) {
          // decrement the time left seen by the players by 1 millisecond
          game.timeLeft = game.timeLeft - timeDiff;
          // save the last time the countdown ran in the game state
          game.lastCountdown = Rune.gameTime();
        }
      }
    }
  },
  updatesPerSecond: 30
})
