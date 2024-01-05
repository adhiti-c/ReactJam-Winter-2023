import { CakeLayerType, GoalType, Goals, PlacableIngredient, RecipeBook } from "./logic_v2/cakeTypes";
import { StartTimeLeftMilliseconds, HintRepeatCount, FlatTimeIncreaseOnComboMilliseconds } from "./logic_v2/logicConfig";
import { Player, GameState } from "./logic_v2/types";
import { compareArraysAsSets, compareArraysInOrder, chooseRandomIndexOfArray, removeFromArray, checkProgress, matchRecipe, combineLayer, giveAllPlayersRandomly } from "./logic_v2/util";

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
        ready: false
      };
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
      // TODO: how do we process only 1 player input? Aka, finishing the cake off
      // if every players have placed, process the build
      // check if game.newLayer matches game.goal
      const currentGoal = game.goals.current;
      // pull the recipe from the recipe book
      const goalRecipe = RecipeBook[currentGoal];
      let success: boolean;
      const currentLayerArray = game.newLayer;

      // check if order matters
      if (goalRecipe.ordered) {
        success = compareArraysInOrder(goalRecipe.recipe, currentLayerArray);
      } else {
        // deep array equivalency
        success = compareArraysAsSets(goalRecipe.recipe, currentLayerArray);
      }

      // if it successfully matched:
      if (success) {
        console.log("successfully made: " + game.goals.current)
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

        // if the goal had a flavor, switch that flavor out of the player’s hand
        // TODO: handle player inventory changes
        // TODO: make sure that like it's a flavor the player has already encountered?

        // if the goal was the same as the current recipe hint, increment the count up
        const gameHint = game.hint;
        if (currentGoal === gameHint.name) {
          game.hint.count = gameHint.count + 1;
        }

        // if count exceeded, generate a new not-created recipe and make that the new goal
        if (game.hint.count >= HintRepeatCount) {
          // generate a new non-created goal to make as the new goal
          // FIXME: can we make this logic better without the special hard-coded cases?
          // special case: if the initial goal is the cake_base, make the players do frosting next as part of the tutorial?
          if (game.goals.current === "cake_base") {
            game.goals.current = "cake_frosting";
            // give players butter and sugar
            game.players = giveAllPlayersRandomly(game.players, ["butter", "sugar"]);
          } else if (game.goals.current === "cake_frosting") {
            // special case: if the goal is cake_frosting, make it a chocolate cake as part of the tutorial?
            game.goals.current = "choco_cake";
            // give players some ingredients
            // remove chocolate from ingredients, and give players something random

            // now given the players the ingredients
            game.players = giveAllPlayersRandomly(game.players, ["chocolate", "strawberry"]);
          } else {
            // choose from the unencountered goals
            // TODO: make sure it is possible to create the next goal based on the player's hand
            const unencounteredRecipes = game.goals.unencountered;
            const randomIndex =
              chooseRandomIndexOfArray(unencounteredRecipes);
            game.goals.current = unencounteredRecipes[randomIndex];
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
        } else {
          // else, move to next goal by grabbing another random recipe. It may be one already learned, or the current hint
          const encounteredRecipes = game.goals.encountered;
          const randomIndex = chooseRandomIndexOfArray(encounteredRecipes);
          game.goals.current = encounteredRecipes[randomIndex];
        }
      } else {
        // if it does not match
        let penalty = true;
        // id the players actually build something?
        let attempted: GoalType | null = matchRecipe(currentLayerArray);

        // if this is a real recipe
        let newLayerCopy = [...currentLayerArray];
        if (attempted) {
          // handle the combination here
          // TODO: switch this with the combineLayer function
          // TODO: maintenance: apply this function to the beginning of the combination mechanic only?
          newLayerCopy = combineLayer(newLayerCopy);

          // // make sure that the thing that was built is part of the current recipe. Players could have been building the basic_cake for the chocolate_cake.
          // // pretend that we built the thing we just tried to make

          // // to build something, we assume that both players have placed already
          // // let's try to combine into what was attempted
          // // remove the recently placed blocks
          // for (const _ of Object.keys(game.players)) {
          //   newLayerCopy.pop()
          // }
          // // add the attempted recipe
          // newLayerCopy.push(attempted);
        }
        // now we figure out if we are making true progress toward the goal
        let isPartOfCurrentGoal = checkProgress(currentGoal, newLayerCopy);

        // if it is part of the current recipe
        if (isPartOfCurrentGoal) {
          // no penalty
          penalty = false;
          if (attempted) {
            // only encourage if something was combined
            game.feedback = "encourage";
          }

          // combine properly
          game.newLayer = newLayerCopy;

          // side note: we keep the current thing in the layer
        } else {
          // not part of current goal
          console.log("not part of current goal")
          // enforce penalty
          penalty = true;
        }
        // else {
        //   // not a real recipe
        //   // enforce penalty
        //   penalty = true;
        // }

        // enforce a penalty, if deserved
        if (penalty) {
          // change the game feedback
          game.feedback = "failure";

          // reset the current layer
          game.newLayer = [];
        }

        // reset placement for players
        // make all players able to place again
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
      // Rune.gameOver(); // TODO: implement this later
    } else {
      if (game.phase === "playing") {
        console.log("counting down")
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
