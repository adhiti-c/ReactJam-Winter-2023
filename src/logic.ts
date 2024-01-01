import { CakeLayerType, Goals, RecipeBook } from "./logic_v2/cakeTypes";
import { StartTimeLeftMilliseconds, HintRepeatCount } from "./logic_v2/logicConfig";
import { Player, GameState } from "./logic_v2/types";
import { checkSetEquivalency, checkArrayDeepEquality, chooseRandomIndexOfArray } from "./logic_v2/util";

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

    const initialGoal: CakeLayerType = "cake_base";
    const initialUnencountered = new Set(Goals)
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
        count: 0
      },
      goals: {
        current: initialGoal,
        encountered: {
          set: new Set([initialGoal]),
          array: [initialGoal]
        },
        unencountered: {
          set: initialUnencountered,
          array: Array.from(initialUnencountered)
        }
      }
    }

    return game;

  },
  actions: {
    placeIngredient({ ingredient }, { allPlayerIds, game, playerId }) {
      // make sure the player has not already placed
      if (game.players[playerId].hasPlaced) {
        throw Rune.invalidAction()
      } else {
        game.players[playerId].hasPlaced = true;
      }

      // add the ingredient to the current recipe
      game.newLayer.push(ingredient);

      // set the player's placed status to be true
      // TODO: how do we process only 1 player input? Aka, finishing the cake off
      // if every players have placed, process the build
      if (Object.values(game.players).every(player => player.hasPlaced)) {
        // check if game.newLayer matches game.goal
        const currentGoal = game.goals.current;
        // pull the recipe from the recipe book
        const goalRecipe = RecipeBook[currentGoal];
        let success: boolean;
        const currentLayerArray = game.newLayer;
        // check if order matters
        if (goalRecipe instanceof Set) {
          // convert current layer to a set
          const currentLayerSet = new Set(currentLayerArray);
          success = checkSetEquivalency(goalRecipe, currentLayerSet);
        } else {
          // deep array equivalency
          success = checkArrayDeepEquality(goalRecipe, currentLayerArray);
        }
        // if it successfully matched:
        if (success) {
          // if the goal had a flavor, switch the flavor out of the player’s hand
          // TODO: handle player inventory changes

          // if the goal was the same as the current recipe hint, increment the count up
          if (currentGoal === game.hint.name) {
            game.hint.count = game.hint.count + 1;
          }

          // TODO: make sure it is possible to create the next goal based on the player's hand
          // if count exceeded, generate a new not-created recipe and make that the new goal
          if (game.hint.count > HintRepeatCount) {
            // generate a new non-created goal to make as the new goal
            // FIXME: can we make this logic better without the special hard-coded case?
            // special case: if the initial goal is the cake_base, make the players do frosting next

            //
          } else {
            // else, move to next goal by grabbing another random recipe. It may be one already learned, or the current hint
            const encounteredRecipes = game.goals.encountered;
            const randomIndex = chooseRandomIndexOfArray(encounteredRecipes.array);
            game.goals.current = encounteredRecipes.array[randomIndex];
          }
        } else {
          // if it does not match
          // make sure that the thing that was built is part of the current recipe
          // if it is, reset placement for players
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
  updatesPerSecond: 30
})
