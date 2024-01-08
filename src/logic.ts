import { PlayerId } from "rune-games-sdk";
import { CakeLayerType, GoalType, Goals, PlacableIngredient, RecipeBook, isFlavor, isGoalType, isPlacableIngredient } from "./logic_v2/cakeTypes";
import { StartTimeLeftMilliseconds, HintRepeatCount, FlatTimeIncreaseOnComboMilliseconds, FlatTimePenaltyMilliseconds, StreakFeedbackFrequency, ScoreMultiplier, LossScreenWaitTimeMilliseconds } from "./logic_v2/logicConfig";
import { Player, GameState } from "./logic_v2/types";
import { compareArraysAsSets, compareArraysInOrder, chooseRandomIndexOfArray, removeFromArray, checkProgress, matchRecipe, combineLayer, giveAllPlayersRandomly, getFlavorsInGoal, isInAnyInventory, countAtomicIngredients, turnRecipeIntoNonCakeParts } from "./logic_v2/util";

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
    const startingIngredientsBase: PlacableIngredient[] = ["eggs", "flour"];
    const startingIngredientsFrosting: PlacableIngredient[] = ["sugar", "butter"];


    // create all players
    const players: Record<string, Player> = {};
    let playerIndex = 0;
    for (const playerId of allPlayerIds) {
      // TODO: this only works for 2 players
      // choose random
      const indexBase = chooseRandomIndexOfArray(startingIngredientsBase);
      // get the ingredient
      const ingredientInventoryBase = startingIngredientsBase.splice(indexBase, 1);

      // do the same for the frosting ingredients
      const indexFrosting = chooseRandomIndexOfArray(startingIngredientsFrosting);
      // get the ingredient
      const ingredientInventoryFrosting = startingIngredientsFrosting.splice(indexFrosting, 1);

      // concat
      const ingredientInventory = ingredientInventoryBase.concat(ingredientInventoryFrosting);


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

    const initialGoal: GoalType = "basic_cake";
    const initialHint: GoalType = "cake_base"
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
        name: initialHint,
        recipe: RecipeBook[initialHint],
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
      const updatedGame = game;
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
      // this is the worst piece of code i've written but there's no time LEFT :skull:
      const updatedGame = game;
      const currentGoal = updatedGame.goals.current;

      let success = false;
      const currentLayerArray = [...updatedGame.newLayer];

      // try to combine
      let combined = false;
      const newLayerCombined = combineLayer(currentLayerArray);
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

        // find a new cake as the goal
        let newGoal: GoalType | undefined = undefined;
        const goalMutable = [...Goals]
        while (newGoal === undefined || !RecipeBook[newGoal].isCake) {
          const randomIndex = chooseRandomIndexOfArray(goalMutable);
          newGoal = goalMutable[randomIndex]
        }

        // set it as the goal
        updatedGame.goals.current = newGoal;

        // set the hint
        updatedGame.hint.name = newGoal;

        const firstComponent = RecipeBook[newGoal].recipe[0];
        console.log("First component", firstComponent)
        // TODO: this breaks for chocolate cake
        if (isGoalType(firstComponent) && RecipeBook[firstComponent].isCake) {
          // go deeper
          // this is basically when a basic_cake is the first component (like for chocolate cakes)
          const firstComponentRecipe = RecipeBook[firstComponent];
          // break it down more
          // this will always be a GoalType, we are hard coding it I guess
          const firstPart = firstComponentRecipe.recipe[0] as GoalType;
          updatedGame.hint.recipe = RecipeBook[firstPart];
          updatedGame.hint.name = firstPart;
        } else if (isGoalType(firstComponent) && !RecipeBook[firstComponent].isCake) {
          // mainly this is 
          // show it
          updatedGame.hint.recipe = RecipeBook[firstComponent];
          updatedGame.hint.name = firstComponent;
        } else {
          // this is a fallback
          console.log("fallback hint")
          updatedGame.hint.recipe = RecipeBook[newGoal];
        }

        // give a player the flavor(s) required to complete this goal
        const flavorsNeeded = getFlavorsInGoal(newGoal);
        for (const flavor of flavorsNeeded) {
          // make sure no players already have this ingredient
          if (!isInAnyInventory(flavor, updatedGame.players)) {
            // give it to the player with the smaller inventory
            let smallestInventoryPlayer: PlayerId | null = null;
            let smallestInventorySize = -1;
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
        // }
      } else {
        // if it does not match
        let penalty = true;

        // now we figure out if we are making true progress toward the goal
        const isPartOfCurrentGoal = checkProgress(currentGoal, newLayerCombined);

        // bring game state up to date
        updatedGame.newLayer = newLayerCombined;

        // if it is part of the current recipe
        if (isPartOfCurrentGoal) {
          // no penalty
          penalty = false;

          if (combined) {
            // figure out what was combined
            // assume it's the newest thing?
            const newest = newLayerCombined.at(-1);
            // FIXME: if you do multiple combinations, you don't get points
            // award points
            if (newest) {
              updatedGame.score = updatedGame.score + countAtomicIngredients(newest) * ScoreMultiplier;
            }

            // the hint should change to be the next thing
            // get the recipe
            const recipe = RecipeBook[currentGoal];
            const brokenUpRecipe = turnRecipeIntoNonCakeParts(currentGoal);

            // break it down into all non-cake components

            // FIXME: this logic only works for the current game
            // figure out where we are
            let recipeIndex = 0;
            for (const item of updatedGame.newLayer) {
              // do a comparison
              // FIXME: this logic only works for ordered stuff. As all cakes are ordered, this is good enough for now
              if (recipe.ordered) {
                // element by element comparison
                if (item !== brokenUpRecipe.at(recipeIndex)) {
                  break;
                }
                recipeIndex++;
              } else {
                console.error(`functionality to generate the next hint for the unordered recipe ${currentGoal} is not implemented yet`)
              }
            }

            // special case: see if the first thing is the cake
            // this is for the cake flavors whose logic breaks this code
            if (updatedGame.newLayer[0] === recipe.recipe[0] && updatedGame.newLayer[0] === "basic_cake" && recipe.recipe[0] === "basic_cake") {
              // show the whole recipe
              updatedGame.hint.name = currentGoal;
              updatedGame.hint.recipe = RecipeBook[currentGoal];
            } else if (recipeIndex < brokenUpRecipe.length) {
              // check the length to make sure it's not out of bounds
              // grab the thing and assign it as the hint, if it is a goal
              const nextHint = brokenUpRecipe.at(recipeIndex);
              if (isGoalType(nextHint)) {
                // reset the hint information and grab the new one
                updatedGame.hint.name = nextHint;
                updatedGame.hint.recipe = RecipeBook[nextHint];
              } else if (isPlacableIngredient(nextHint)) {
                // this might be an ingredient? I don't think this code runs though
                updatedGame.hint.name = currentGoal;
                updatedGame.hint.recipe = RecipeBook[currentGoal];
              }
            } else {
              console.error(`Something is off when generating the new hint, with the indices`)
            }


            // give feedback
            updatedGame.feedback = "encourage";
          }

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

          // reset the hint
          // set it as the goal
          const newGoal = updatedGame.goals.current;

          // reset the hint

          const firstComponent = RecipeBook[newGoal].recipe[0];
          console.log("First component", firstComponent)
          // TODO: this breaks for chocolate cake
          if (isGoalType(firstComponent) && RecipeBook[firstComponent].isCake) {
            // go deeper
            // this is basically when a basic_cake is the first component (like for chocolate cakes)
            const firstComponentRecipe = RecipeBook[firstComponent];
            // break it down more
            // this will always be a GoalType, we are hard coding it I guess
            const firstPart = firstComponentRecipe.recipe[0] as GoalType;
            updatedGame.hint.recipe = RecipeBook[firstPart];
            updatedGame.hint.name = firstPart;
          } else if (isGoalType(firstComponent) && !RecipeBook[firstComponent].isCake) {
            // mainly this is 
            // show it
            updatedGame.hint.recipe = RecipeBook[firstComponent];
            updatedGame.hint.name = firstComponent;
          } else {
            // this is a fallback
            console.log("fallback hint")
            updatedGame.hint.recipe = RecipeBook[newGoal];
          }
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
  update: ({ game, allPlayerIds }) => {
    // if the players are currently playing
    if (game.phase === "lobby") {
      if (game.timeLeft < 0) {
        // bring players to the playing screen
        // start the real game countdown from when we moved over
        game.lastCountdown = Rune.gameTime();
        // send the players to the "playing" screen
        game.phase = "playing";
        // set feedback to be go
        game.feedback = "start";
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
    } else if (game.phase === "playing") {
      if (game.timeLeft > 0) {
        // count down
        const timeDiff = Rune.gameTime() - game.lastCountdown;
        // if we counting down, count down every second
        if (timeDiff >= 1) {
          // decrement the time left seen by the players by 1 millisecond
          game.timeLeft = game.timeLeft - timeDiff;
          // save the last time the countdown ran in the game state
          game.lastCountdown = Rune.gameTime();
        }
      } else {
        // game over for players
        // set the phase to be loss
        game.timeLeft = 0;
        game.phase = "stop";

        game.timeLeft = 3000;
        game.lastCountdown = Rune.gameTime();
      }
    } else if (game.phase === "stop") {
      if (game.timeLeft > 0) {
        const timeDiff = Rune.gameTime() - game.lastCountdown;
        // if we counting down, count down every second
        if (timeDiff >= 1) {
          // decrement the time left seen by the players by 1 millisecond
          game.timeLeft = game.timeLeft - timeDiff;
          // save the last time the countdown ran in the game state
          game.lastCountdown = Rune.gameTime();
        }
      } else {
        // bring to see high score
        game.phase = "loss"
        game.timeLeft = LossScreenWaitTimeMilliseconds;
        game.lastCountdown = Rune.gameTime();
      }
    } else if (game.phase === "loss") {
      if (game.timeLeft < 0) {
        // make everyone lose
        const playerStatus: { [playerId: string]: number | "WON" | "LOST"; } = {}
        // add all players to the game over screen with the score
        allPlayerIds.forEach(playerId => {
          playerStatus[playerId] = game.score;
        });
        Rune.gameOver({
          players: playerStatus,
        });
      } else {
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
