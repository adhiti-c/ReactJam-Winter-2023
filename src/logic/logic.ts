// where the central rune multiplayer game logic lives
import rune from "rune-games-sdk";
import { GameState, Player } from "./types";

rune.initLogic({
    minPlayers: 2,
    maxPlayers: 2,
    setup: (allPlayerIds) => {
        // create a new player
        const players: Player[] = [];

        for (const [index, playerId] of allPlayerIds.entries()) {
            // create a new player
            players.push(
                {
                    id: playerId,
                    position: {
                        x: 0,
                        y: 0,
                        z: 0,
                    },
                    number: index
                }
            )
        }

        // create the game state
        const game: GameState = {
            ingredients: [],
            players: players,
            cake: [],
            syrup: {
                height: 0,
                velocity: 1,
            },
            currentRecipe: {
                recipe: {
                    eggs: 1,
                },
                color: "" // TODO: fixme
            },
            score: 0,
            highScore: 0
        }

        return game;
    },
    actions: {

    }
})