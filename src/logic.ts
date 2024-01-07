import { PlayerId } from "rune-games-sdk";
import { CakeLayerType, GoalType, Goals, PlacableIngredient, RecipeBook, isFlavor } from "./logic_v2/cakeTypes";
import { StartTimeLeftMilliseconds, HintRepeatCount, FlatTimeIncreaseOnComboMilliseconds, FlatTimePenaltyMilliseconds, StreakFeedbackFrequency, ScoreMultiplier } from "./logic_v2/logicConfig";
import { Player, GameState } from "./logic_v2/types";
import { compareArraysAsSets, compareArraysInOrder, chooseRandomIndexOfArray, removeFromArray, checkProgress, matchRecipe, combineLayer, giveAllPlayersRandomly, getFlavorsInGoal, isInAnyInventory, countAtomicIngredients } from "./logic_v2/util";

/*
random thoughts:
- say we have a finisher flavor (aka only 1 player adds an ingredient.) do we immediately process?
- do we actually check if we are making progress toward the goal during each placement instead?
- this logic may break if we have spectators! make some sort of array of player IDs I think, maybe. Like, baker IDs
*/

Rune.initLogic({
  minPlayers: 2,
  maxPlayers: 2,
  setup: (allPlayerIds): GameState => {

    // define initial starting ingredients that will be spread out across all players
    const startingIngredients: PlacableIngredient[] = ["eggs", "flour"];

    // create all players
    const players: Record<string, Player> = {};
    let playerIndex = 0;
    for (const playerId of allPlayerIds) {
      // choose random
      const index = chooseRandomIndexOfArray(startingIngredients);
      // get the ingredient
      const ingredientInventory = startingIngredients.splice(index, 1);

      // create player
      players[playerId] = {
        id: playerId,
        inventory: ingredientInventory,
        hasPlaced: false,
        ready: false,
        number: playerIndex,
        encounteredInventory: ingredientInventory,
      };
      playerIndex++;
    }

    const initialGoal: CakeLayerType = "cake_base";
    const initialUnencountered = new Set(Goals);
    initialUnencountered.delete(initialGoal);

    // create the game state
    const game: GameState = {
      lastCountdown: 0,
      timeLeft: StartTimeLeftMilliseconds,
      phase: "lobby",
      feedback: "waiting",
      players: players,
      cake: [],
      score: 0,
      newLayer: [],
      hint: {
        name: initialGoal,
        recipe: RecipeBook[initialGoal],
        count: 0,
      },
      goals: {
        current: initialGoal,
        encountered: [initialGoal],
        unencountered: removeFromArray([...Goals], initialGoal),
      },
      ready: true,
      isStartingCountdown: false,
      streak: 0,
    };

    return game;
  },
  actions: {
    placeIngredient({ ingredient }, { allPlayerIds, game, playerId }) {
      let updatedGame = game;
      // make sure the player has not already placed
      if (updatedGame.players[playerId].hasPlaced) {
        throw Rune.invalidAction();
      } else {
        updatedGame.players[playerId].hasPlaced = true;
        // set feedback to waiting
        updatedGame.feedback = "waiting";
      }

      // add the ingredient to the current recipe
      updatedGame.newLayer.push(ingredient);
      game = updatedGame;
    },
    setGamePhase({ phase }, { allPlayerIds, game, playerId }) {
      // change the game phase to be whatever we want
      game.phase = phase
      if (phase === "playing") {
        // start the countdown from when we moved over
        game.lastCountdown = Rune.gameTime();
      }
    },
    combine(_, { game, playerId }) {
      let updatedGame = game;
      const currentGoal = updatedGame.goals.current;

      let success = false;
      const currentLayerArray = [...updatedGame.newLayer];

      // try to combine
      let combined = false;
      let newLayerCombined = combineLayer(currentLayerArray);
      // if these are different, something was combined
      if (!compareArraysInOrder(currentLayerArray, newLayerCombined)) {
        combined = true;
      }

      // check if the goal was reached
      if (combined && newLayerCombined.length === 1 && newLayerCombined[0] === currentGoal) {
        success = true;
      }

      // if it successfully matched:
      if (success) {
        // add the goal to the overall cake layer
        updatedGame.cake.push(updatedGame.goals.current);

        // increment the score
        // calculate the score by doing a recursive counting of atomic elements search of the current goal
        updatedGame.score = updatedGame.score + countAtomicIngredients(currentGoal) * ScoreMultiplier;

        // reward by adding time
        updatedGame.timeLeft = updatedGame.timeLeft + FlatTimeIncreaseOnComboMilliseconds;

        // set feedback to be success
        updatedGame.feedback = "success";

        // add one to the streak
        updatedGame.streak = updatedGame.streak + 1;

        // see if we want the streak feedback
        if (updatedGame.streak % StreakFeedbackFrequency === 0) {
          updatedGame.feedback = "streak";
        }

        // reset the current layer
        updatedGame.newLayer = [];

        // make all players able to place again
        for (const player in updatedGame.players) {
          updatedGame.players[player].hasPlaced = false;
        }

        // see what the old goal had
        const flavorsInOldGoal = getFlavorsInGoal(currentGoal);

        // if there were flavors in the goal that was just completed, remove it out of the respective player's hand
        if (flavorsInOldGoal.length > 0) {
          for (const flavor of flavorsInOldGoal) {
            for (const player in updatedGame.players) {
              const oldPlayerInventory = [...updatedGame.players[player].inventory]
              if (oldPlayerInventory.includes(flavor)) {
                // remove it
                const removedInventory = removeFromArray(oldPlayerInventory, flavor);
                updatedGame.players[player].inventory = removedInventory;
              }
            }
          }
        }

        // if the goal was the same as the current recipe hint, increment the count up
        const gameHint = updatedGame.hint;
        if (currentGoal === gameHint.name) {
          updatedGame.hint.count = gameHint.count + 1;
        }

        // if count exceeded, generate a new not-created recipe and make that the new goal
        const unencounteredRecipes = updatedGame.goals.unencountered;
        if (updatedGame.hint.count >= HintRepeatCount && unencounteredRecipes.length > 0) {
          // generate a new non-created goal to make as the new goal
          // FIXME: can we make this logic better without the special hard-coded cases?
          // special case: if the initial goal is the cake_base, make the players do frosting next as part of the tutorial?
          if (updatedGame.goals.current === "cake_base" && updatedGame.goals.unencountered.includes("cake_frosting")) {
            updatedGame.goals.current = "cake_frosting";
            // give players butter and sugar
            updatedGame.players = giveAllPlayersRandomly(updatedGame.players, ["butter", "sugar"]);
          } else if (updatedGame.goals.current === "cake_frosting" && updatedGame.goals.unencountered.includes("basic_cake")) {
            // special case: if the goal is cake_frosting, make it a basic cake as part of the tutorial
            updatedGame.goals.current = "basic_cake";
          } else if (updatedGame.goals.current === "basic_cake" && updatedGame.goals.unencountered.includes("choco_cake")) {
            // special case: if the goal is basic_cake, make it a chocolate cake as part of the tutorial
            updatedGame.goals.current = "choco_cake";
            // give players some ingredients
            // remove chocolate from ingredients, and give players something random

            // now given the players the ingredients
            updatedGame.players = giveAllPlayersRandomly(updatedGame.players, ["chocolate", "strawberry"]);
          } else {
            // choose from the unencountered goals
            const randomIndex = chooseRandomIndexOfArray(unencounteredRecipes);
            const newGoal = unencounteredRecipes[randomIndex]
            updatedGame.goals.current = newGoal;
            // TODO: give a player the flavor(s) required to complete this goal
            const flavorsNeeded = getFlavorsInGoal(newGoal);
            for (const flavor of flavorsNeeded) {
              // give it to the player with the smaller inventory
              if (!isInAnyInventory(flavor, updatedGame.players)) {
                let smallestInventoryPlayer: PlayerId | null = null;
                let smallestInventorySize: number = -1;
                for (const player in updatedGame.players) {
                  const inventory = updatedGame.players[player].inventory
                  if (smallestInventorySize === -1 || inventory.length < smallestInventorySize) {
                    smallestInventoryPlayer = player;
                    smallestInventorySize = inventory.length;
                  }
                }
                // note: if all equal, give it to the first person
                // smallestInventoryPlayer should always be defined
                const currentInventory = [...updatedGame.players[smallestInventoryPlayer!].inventory];
                currentInventory.push(flavor);
                updatedGame.players[smallestInventoryPlayer!].inventory = currentInventory;
              }
            }
          }

          const newGoal = updatedGame.goals.current;

          // reset the hint information and grab the new one
          updatedGame.hint.count = 0;
          updatedGame.hint.name = newGoal;
          updatedGame.hint.recipe = RecipeBook[newGoal];

          // move the new goal to be encountered
          let oldEncountered = [...updatedGame.goals.encountered];
          oldEncountered.push(newGoal);
          updatedGame.goals.encountered = oldEncountered;
          // remove from unencountered
          let oldUnencountered = [...updatedGame.goals.unencountered];
          updatedGame.goals.unencountered = removeFromArray(oldUnencountered, newGoal);
        } else {
          // else, move to next goal by grabbing another random recipe. It may be one already learned, or the current hint

          const encounteredRecipes = updatedGame.goals.encountered;
          const randomIndex = chooseRandomIndexOfArray(encounteredRecipes);
          const newGoal = encounteredRecipes[randomIndex]
          updatedGame.goals.current = newGoal;

          // give a player the flavor(s) required to complete this goal
          const flavorsNeeded = getFlavorsInGoal(newGoal);
          for (const flavor of flavorsNeeded) {
            // make sure no players already have this ingredient
            if (!isInAnyInventory(flavor, updatedGame.players)) {
              // give it to the player with the smaller inventory
              let smallestInventoryPlayer: PlayerId | null = null;
              let smallestInventorySize: number = -1;
              for (const player in updatedGame.players) {
                const inventory = updatedGame.players[player].inventory
                if (smallestInventorySize === -1 || inventory.length < smallestInventorySize) {
                  smallestInventoryPlayer = player;
                  smallestInventorySize = inventory.length;
                }
              }
              // note: if all equal, give it to the first person
              // smallestInventoryPlayer should always be defined
              const currentInventory = [...updatedGame.players[smallestInventoryPlayer!].inventory];
              currentInventory.push(flavor);
              updatedGame.players[smallestInventoryPlayer!].inventory = currentInventory;
            }
          }
        }
      } else {
        // if it does not match
        let penalty = true;

        // now we figure out if we are making true progress toward the goal
        let isPartOfCurrentGoal = checkProgress(currentGoal, newLayerCombined);

        // if it is part of the current recipe
        if (isPartOfCurrentGoal) {
          // no penalty
          penalty = false;

          if (combined) {
            // figure out what was combined
            // assume it's the newest thing?
            const newest = newLayerCombined.at(-1);
            // TODO: if you do multiple combinations, you don't get points
            // award points
            if (newest) {
              updatedGame.score = updatedGame.score + countAtomicIngredients(newest) * ScoreMultiplier;
            }

            // give feedback
            updatedGame.feedback = "encourage";
          }

          // bring game state up to date
          updatedGame.newLayer = newLayerCombined;

          // side note: we keep the current thing in the layer
        } else {
          // not part of current goal
          console.log("not part of current goal")
          // enforce penalty
          penalty = true;
        }

        // enforce a penalty, if deserved
        if (penalty) {
          // change the game feedback
          updatedGame.feedback = "failure";

          // reset the current layer
          updatedGame.newLayer = [];

          // subtract time
          updatedGame.timeLeft = updatedGame.timeLeft - FlatTimePenaltyMilliseconds;
        }

        // reset placement for players
        // make all players able to place again if a penalty has happened or every player has placed
        if (penalty || (Object.values(updatedGame.players).every((player) => player.hasPlaced)))
          for (const player in updatedGame.players) {
            updatedGame.players[player].hasPlaced = false;
          }
      }
      // bring the state up to date
      game = updatedGame;
    },
    toggleReady(_, { allPlayerIds, game, playerId }) {
      // toggle the current player's ready status
      game.players[playerId].ready = !game.players[playerId].ready;
      // if all players are ready, begin countdown
      if ((Object.values(game.players).every((player) => player.ready))) {
        if (game.phase === "lobby") {
          // trigger a countdown to send players to the next screen
          game.timeLeft = 3000;
          game.lastCountdown = Rune.gameTime();
          game.isStartingCountdown = true;
        }
      } else {
        game.isStartingCountdown = false;
      }
    }
  },
  update: ({ game }) => {
    // if the players are currently playing
    if (game.phase === "playing") {
      if (game.timeLeft < 0) {
        // game over for players
        // set the phase to be loss
        game.phase = "loss";
        game.timeLeft = 0;
        Rune.gameOver(); // TODO: implement this later
      } else {
        // count down
        const timeDiff = Rune.gameTime() - game.lastCountdown;
        // if we counting down, count down every second
        if (timeDiff >= 1) {
          // decrement the time left seen by the players by 1 millisecond
          game.timeLeft = game.timeLeft - timeDiff;
          // save the last time the countdown ran in the game state
          game.lastCountdown = Rune.gameTime();
        }
      }
    } else if (game.phase === "lobby") {
      if (game.timeLeft < 0) {
        // bring players to the playing screen
        // start the real game countdown from when we moved over
        game.lastCountdown = Rune.gameTime();
        // send the players to the "playing" screen
        game.phase = "playing";
        // start the timer for the playing game
        game.timeLeft = StartTimeLeftMilliseconds;
      } else if (game.isStartingCountdown && (Object.values(game.players).every((player) => player.ready))) {
        // if all players are ready, start counting down
        // count down
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
  updatesPerSecond: 30,
});
