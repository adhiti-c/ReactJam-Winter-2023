// where the central rune multiplayer game logic lives
import rune from "rune-games-sdk";
import { GameState, Player, Position } from "./types";
import { defaultIngredientSpawnInterval, defaultSyrupVelocity } from "./logicConfig";

rune.initLogic({
    minPlayers: 2,
    maxPlayers: 2,
    setup: (allPlayerIds) => {
        // create a new player
        const players: Record<string, Player> = {};

        for (const [index, playerId] of allPlayerIds.entries()) {
            // create a new player
            players[playerId] =
            {
                id: playerId,
                position: {
                    x: 0,
                    y: 0,
                    z: 0,
                },
                number: index
            }

        }

        // create the game state
        const game: GameState = {
            ingredients: [],
            players: players,
            cake: [],
            syrup: {
                height: 0,
                velocity: defaultSyrupVelocity,
            },
            currentRecipe: {
                recipe: { // TODO: pull a random recipe from a list of recipes, or something
                    eggs: 1,
                },
                color: "" // TODO: fixme
            },
            score: 0,
            highScore: 0,
            lastIngredientSpawnTime: 0,
            ingredientSpawnInterval: defaultIngredientSpawnInterval,
            currentCakeLayer: {
                recipe: {},
            }
        }

        return game;
    },
    actions: {
        playerMove(position: Position, { game, playerId }) {
            // update player position
            game.players[playerId].position = position;
        }
    },
    update: ({ game }) => {
        // spawn ingredient every so often
        if (rune.gameTime() - game.lastIngredientSpawnTime > game.ingredientSpawnInterval) {
            // spawn an ingredient
            console.log("ingredient spawned");
        }
    }
})