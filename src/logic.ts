import { CakeLayerType, Goals, RecipeBook } from "./logic_v2/cakeTypes";
import {
  StartTimeLeftMilliseconds,
  HintRepeatCount,
} from "./logic_v2/logicConfig";
import { Player, GameState } from "./logic_v2/types";
import {
  checkSetEquivalency,
  checkArrayDeepEquality,
  chooseRandomIndexOfArray,
  removeFromArray,
} from "./logic_v2/util";

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
        hasPlaced: false,
      };
    }

    const initialGoal: CakeLayerType = "cake_base";
    const initialUnencountered = new Set(Goals);
    initialUnencountered.delete(initialGoal);

    // create the game state
    const game: GameState = {
      lastCountdown: 0,
      timeLeft: StartTimeLeftMilliseconds,
      phase: "playing",
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
      }

      // add the ingredient to the current recipe
      game.newLayer.push(ingredient);

      // set the player's placed status to be true
      // TODO: how do we process only 1 player input? Aka, finishing the cake off
      // if every players have placed, process the build
      if (Object.values(game.players).every((player) => player.hasPlaced)) {
        // check if game.newLayer matches game.goal
        const currentGoal = game.goals.current;
        // pull the recipe from the recipe book
        const goalRecipe = RecipeBook[currentGoal];
        let success: boolean;
        const currentLayerArray = game.newLayer;

        // check if order matters
        if (goalRecipe.ordered) {
          // convert current layer to a set
          const currentLayerSet = new Set(currentLayerArray);
          // convert recipe to a set
          const goalSet = new Set(goalRecipe.recipe);
          success = checkSetEquivalency(goalSet, currentLayerSet);
        } else {
          // deep array equivalency
          success = checkArrayDeepEquality(
            goalRecipe.recipe,
            currentLayerArray,
          );
        }

        // if it successfully matched:
        if (success) {
          // add the goal to the overall cake layer
          game.cake.push(game.goals.current);

          // increment the score
          game.score = game.score + 1;

          // set feedback to be success
          game.feedback = "success";

          // reset the current layer
          game.newLayer = [];

          // make all players able to place again
          for (const player in game.players) {
            game.players[player].hasPlaced = false;
          }

          // if the goal had a flavor, switch the flavor out of the player’s hand
          // TODO: handle player inventory changes

          // if the goal was the same as the current recipe hint, increment the count up
          const gameHint = game.hint;
          if (currentGoal === gameHint.name) {
            game.hint.count = gameHint.count + 1;
          }

          // TODO: make sure it is possible to create the next goal based on the player's hand
          // if count exceeded, generate a new not-created recipe and make that the new goal
          if (game.hint.count >= HintRepeatCount) {
            // generate a new non-created goal to make as the new goal
            // FIXME: can we make this logic better without the special hard-coded cases?
            // special case: if the initial goal is the cake_base, make the players do frosting next as part of the tutorial?
            if (game.goals.current === "cake_base") {
              game.goals.current = "cake_frosting";
            } else if (game.goals.current === "cake_frosting") {
              // special case: if the goal is cake_frosting, make it a chocolate cake as part of the tutorial?
              game.goals.current = "choco_cake";
            } else {
              // choose from the unencountered goals
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
          // make sure that the thing that was built is part of the current recipe
          // if it is
          // reset placement for players
          // // make all players able to place again
          // for (const player in game.players) {
          //   game.players[player].hasPlaced = false;
          // }
          // keep the current thing in the layer
          // enforce a penalty
        }
      } else {
        // a player still needs to place
        // ??? what else do we need to do here? Do we need to do anything?
        // do we set the player's status to be "waiting"?
      }
    },
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
  updatesPerSecond: 30,
});
