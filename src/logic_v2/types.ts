import type { PlayerId, RuneClient } from "rune-games-sdk/multiplayer"

/**
 * an atomic ingredient that combines to make a cake component
 */
export type IngredientType = "eggs" | "butter" | "sugar" | "flour";
export type Flavor = "strawberry" | "chocolate"

export interface Player {
    id: PlayerId,
    inventory: (IngredientType | null)[];
}

/**
 * information about each cake layer
 */
export interface Cake {
    // a cake consists of a cake base, frosting, and an extra ingredient as flavor
    base: CakeComponent,
    frosting: CakeComponent,
    flavor: Flavor,
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
    countingDown: boolean,
    players: Record<string, Player>,        // information about each player
    cake: Cake[],          // what has already been built
    score: number,              // score
    // currentRecipe: Cake,   // what is currently being built
    // currentCakeLayer: Partial<Cake>,        // what the current layer looks like
    // recipeHint: Cake,           // hint as to how to build the current layer
}

type GameActions = {
    // increment: (params: { amount: number }) => void
}

declare global {
    const Rune: RuneClient<GameState, GameActions>
}