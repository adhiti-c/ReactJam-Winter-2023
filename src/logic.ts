import { PlayerId } from "rune-games-sdk";
import { CakeLayerType, GoalType, Goals, PlacableIngredient, RecipeBook, isFlavor } from "./logic_v2/cakeTypes";
import { StartTimeLeftMilliseconds, HintRepeatCount, FlatTimeIncreaseOnComboMilliseconds, FlatTimePenaltyMilliseconds } from "./logic_v2/logicConfig";
import { Player, GameState } from "./logic_v2/types";
import { compareArraysAsSets, compareArraysInOrder, chooseRandomIndexOfArray, removeFromArray, checkProgress, matchRecipe, combineLayer, giveAllPlayersRandomly, getFlavorsInGoal, isInAnyInventory } from "./logic_v2/util";

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
      ready: true
    };

    return game;
  },
  actions: {
    placeIngredient({ ingredient }, { allPlayerIds, game, playerId }) {
      // make sure the player has not already placed
      if (game.players[playerId].hasPlaced) {
        throw Rune.invalidAction();
      } else {
        game.players[playerId].hasPlaced = true;
        // set feedback to waiting
        game.feedback = "waiting";
      }

      // add the ingredient to the current recipe
      game.newLayer.push(ingredient);
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
      // check if game.newLayer matches game.goal
      const currentGoal = game.goals.current;

      let success = false;
      const currentLayerArray = [...game.newLayer];

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
        game.cake.push(game.goals.current);

        // increment the score
        game.score = game.score + 1;

        // reward by adding time
        game.timeLeft = game.timeLeft + FlatTimeIncreaseOnComboMilliseconds;

        // set feedback to be success
        game.feedback = "success";

        // reset the current layer
        game.newLayer = [];

        // make all players able to place again
        for (const player in game.players) {
          game.players[player].hasPlaced = false;
        }

        // see what the old goal had
        const flavorsInOldGoal = getFlavorsInGoal(currentGoal);

        // if there were flavors in the goal that was just completed, remove it out of the respective player's hand
        if (flavorsInOldGoal.length > 0) {
          for (const flavor of flavorsInOldGoal) {
            for (const player in game.players) {
              const oldPlayerInventory = [...game.players[player].inventory]
              if (oldPlayerInventory.includes(flavor)) {
                // remove it
                const removedInventory = removeFromArray(oldPlayerInventory, flavor);
                game.players[player].inventory = removedInventory;
              }
            }
          }
        }

        // if the goal was the same as the current recipe hint, increment the count up
        const gameHint = game.hint;
        if (currentGoal === gameHint.name) {
          game.hint.count = gameHint.count + 1;
        }

        // if count exceeded, generate a new not-created recipe and make that the new goal
        const unencounteredRecipes = game.goals.unencountered;
        if (game.hint.count >= HintRepeatCount && unencounteredRecipes.length > 0) {
          // generate a new non-created goal to make as the new goal
          // FIXME: can we make this logic better without the special hard-coded cases?
          // special case: if the initial goal is the cake_base, make the players do frosting next as part of the tutorial?
          if (game.goals.current === "cake_base" && game.goals.unencountered.includes("cake_frosting")) {
            game.goals.current = "cake_frosting";
            // give players butter and sugar
            game.players = giveAllPlayersRandomly(game.players, ["butter", "sugar"]);
          } else if (game.goals.current === "cake_frosting" && game.goals.unencountered.includes("basic_cake")) {
            // special case: if the goal is cake_frosting, make it a basic cake as part of the tutorial
            game.goals.current = "basic_cake";
          } else if (game.goals.current === "basic_cake" && game.goals.unencountered.includes("choco_cake")) {
            // special case: if the goal is basic_cake, make it a chocolate cake as part of the tutorial
            game.goals.current = "choco_cake";
            // give players some ingredients
            // remove chocolate from ingredients, and give players something random

            // now given the players the ingredients
            game.players = giveAllPlayersRandomly(game.players, ["chocolate", "strawberry"]);
          } else {
            // choose from the unencountered goals
            const randomIndex = chooseRandomIndexOfArray(unencounteredRecipes);
            const newGoal = unencounteredRecipes[randomIndex]
            game.goals.current = newGoal;
            // TODO: give a player the flavor(s) required to complete this goal
            const flavorsNeeded = getFlavorsInGoal(newGoal);
            for (const flavor of flavorsNeeded) {
              // give it to the player with the smaller inventory
              let smallestInventoryPlayer: PlayerId | null = null;
              let smallestInventorySize: number = -1;
              for (const player in game.players) {
                const inventory = game.players[player].inventory
                if (smallestInventorySize === -1 || inventory.length < smallestInventorySize) {
                  smallestInventoryPlayer = player;
                  smallestInventorySize = inventory.length;
                }
              }
              // note: if all equal, give it to the first person
              // smallestInventoryPlayer should always be defined
              const currentInventory = [...game.players[smallestInventoryPlayer!].inventory];
              currentInventory.push(flavor);
              game.players[smallestInventoryPlayer!].inventory = currentInventory;
            }
          }

          const newGoal = game.goals.current;

          // reset the hint information and grab the new one
          game.hint.count = 0;
          game.hint.name = newGoal;
          game.hint.recipe = RecipeBook[newGoal];

          // move the new goal to be encountered
          let oldEncountered = [...game.goals.encountered];
          oldEncountered.push(newGoal);
          game.goals.encountered = oldEncountered;
          // remove from unencountered
          let oldUnencountered = [...game.goals.unencountered];
          game.goals.unencountered = removeFromArray(oldUnencountered, newGoal);
        } else {
          // else, move to next goal by grabbing another random recipe. It may be one already learned, or the current hint

          const encounteredRecipes = game.goals.encountered;
          const randomIndex = chooseRandomIndexOfArray(encounteredRecipes);
          const newGoal = encounteredRecipes[randomIndex]
          game.goals.current = newGoal;

          // TODO: give a player the flavor(s) required to complete this goal
          const flavorsNeeded = getFlavorsInGoal(newGoal);
          for (const flavor of flavorsNeeded) {
            // make sure no players already have this ingredient
            if (!isInAnyInventory(flavor, game.players)) {
              // give it to the player with the smaller inventory
              let smallestInventoryPlayer: PlayerId | null = null;
              let smallestInventorySize: number = -1;
              for (const player in game.players) {
                const inventory = game.players[player].inventory
                if (smallestInventorySize === -1 || inventory.length < smallestInventorySize) {
                  smallestInventoryPlayer = player;
                  smallestInventorySize = inventory.length;
                }
              }
              // note: if all equal, give it to the first person
              // smallestInventoryPlayer should always be defined
              const currentInventory = [...game.players[smallestInventoryPlayer!].inventory];
              currentInventory.push(flavor);
              game.players[smallestInventoryPlayer!].inventory = currentInventory;
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

          // only encourage if something was combined
          if (combined) {
            game.feedback = "encourage";
          }

          // bring game state up to date
          game.newLayer = newLayerCombined;

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
          game.feedback = "failure";

          // reset the current layer
          game.newLayer = [];

          // subtract time
          game.timeLeft = game.timeLeft - FlatTimePenaltyMilliseconds;
        }

        // reset placement for players
        // make all players able to place again if a penalty has happened or every player has placed
        if (penalty || (Object.values(game.players).every((player) => player.hasPlaced)))
          for (const player in game.players) {
            game.players[player].hasPlaced = false;
          }
      }
    }
  },
  update: ({ game }) => {
    // check if the time is gone
    if (game.timeLeft < 0) {
      // set the phase to be loss
      game.phase = "loss";
      game.timeLeft = 0;
      Rune.gameOver(); // TODO: implement this later
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
  updatesPerSecond: 30,
});
