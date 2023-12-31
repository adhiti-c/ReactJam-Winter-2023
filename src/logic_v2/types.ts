import type { PlayerId, RuneClient } from "rune-games-sdk/multiplayer"
import { IngredientType, Flavor } from "./cakeTypes";

/**
 * the current phase of the game
 */
export type GamePhase = "tutorial" | "playing" | "loss";

export type Feedback = "waiting" | "success" | "failure"

export interface Player {
    id: PlayerId,
    inventory: (IngredientType | null)[];
    hasPlaced: boolean,
}

/**
 * information about each cake layer
 */
export interface Cake {
    // a cake consists of a cake base, frosting, and an extra ingredient as flavor
    base: CakeComponent,
    frosting: CakeComponent,
    flavor: Flavor | null,
}

/**
 * these components together will make a cake
 */
export interface CakeComponent {
    recipe: Set<IngredientType>,
}

export interface GameState {
    lastCountdown: number,                  // to track time at last countdown in milliseconds
    timeLeft: number,                       // amount of time left in milliseconds
    phase: GamePhase,                       // the current phase of the game
    feedback: Feedback,                     // the feedback aka whether the build failed or was successful, or if it's in progress
    players: Record<string, Player>,        // information about each player
    cake: Cake[],          // what has already been built
    score: number,              // score
    // currentRecipe: Cake,   // what is currently being built
    // currentCakeLayer: Partial<Cake>,        // what the current layer looks like
    // recipeHint: { // hint as to how to build the current layer
    //     cake: Cake, // recipe for layer
    //     repeat: number // number of times baked
    // },
}

type GameActions = {
    // increment: (params: { amount: number }) => void
    placeIngredient: (params: { ingredient: IngredientType | Flavor }) => void;
}

declare global {
    const Rune: RuneClient<GameState, GameActions>
}