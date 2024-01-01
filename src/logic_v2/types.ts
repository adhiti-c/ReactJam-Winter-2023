import type { PlayerId, RuneClient } from "rune-games-sdk/multiplayer"
import { CakeLayerType, PlacableIngredient, GoalType, Recipe } from "./cakeTypes";

/**
 * the current phase of the game
 */
export type GamePhase = "tutorial" | "playing" | "loss";

export type Feedback = "waiting" | "success" | "failure"

export interface Player {
    id: PlayerId,
    inventory: (PlacableIngredient | null)[];
    hasPlaced: boolean,
}

export interface GameState {
    lastCountdown: number,                  // to track time at last countdown in milliseconds
    timeLeft: number,                       // amount of time left in milliseconds
    phase: GamePhase,                       // the current phase of the game
    feedback: Feedback,                     // the feedback aka whether the build failed or was successful, or if it's in progress
    players: Record<PlayerId, Player>,      // information about each player. Keyed by player id with value of the player object
    cake: CakeLayerType[],                  // what has already been built, essentially, what has been built before the current goal
    score: number,                          // score/number of layers
    goal: GoalType,                         // the current goal
    newLayer: CakeLayerType[],              // what has been built while trying to achieve the current goal
    hint: {                                 // hint as to how to build the newest learned GoalType
        recipe: Recipe,                         // recipe for the GoalType
        count: number                           // number of times baked
    },
    recipesLearned: Set<GoalType>           // set of goals encountered
}

type GameActions = {
    // increment: (params: { amount: number }) => void
    placeIngredient: (params: { ingredient: PlacableIngredient }) => void;
}

declare global {
    const Rune: RuneClient<GameState, GameActions>
}