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
    /**
     * to track time at last countdown in milliseconds
     */
    lastCountdown: number,
    /**
     * amount of time left in milliseconds
     */
    timeLeft: number,
    /**
     * the current phase of the game
     */
    phase: GamePhase,
    /**
     * the feedback aka whether the build failed or was successful, or if it's in progress
     */
    feedback: Feedback,
    /**
     * information about each player. Keyed by player id with value of the player object
     */
    players: Record<PlayerId, Player>,
    /**
     * what has already been built, essentially, what has been built before the current goal
     */
    cake: CakeLayerType[],
    /**
     * score/number of layers
     */
    score: number,
    /**
     * the current goal. What the players need to build next.
     */
    goal: GoalType,
    /**
     * what has been built while trying to achieve the current goal. May be wrong
     */
    newLayer: CakeLayerType[],
    /**
     * hint as to how to build the newest learned GoalType
     */
    hint: {
        /**
         * recipe for the GoalType
         */
        recipe: Recipe,
        /**
         * number of times this hint has been baked. Once it reaches a certain threshold, the players should have it memorized
         */
        count: number
    },
    /**
     *  set of goals whose hints have already been completed. Aka, the goals whose recipes the player should have memorized by now.
     */
    recipesLearned: Set<GoalType>
}

type GameActions = {
    // increment: (params: { amount: number }) => void
    placeIngredient: (params: { ingredient: PlacableIngredient }) => void;
}

declare global {
    const Rune: RuneClient<GameState, GameActions>
}