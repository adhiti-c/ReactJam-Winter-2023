import { PlayerId, RuneClient } from "rune-games-sdk"

declare global {
    const Rune: RuneClient<GameState, GameActions>
}

export interface Position {
    x: number,
    y: number,
    z: number,
    // rotation: number
}

export interface Player {
    id: PlayerId,     // the rune id
    position: Position,
    number: number  // the index of the array in the game state logic
}

export type IngredientType = "eggs" | "milk" | "butter" | "sugar" | "flour";
export type WorkStationType = "oven";

export interface Ingredient {
    position: Position,
    type: IngredientType,
}

export interface WorkStation {
    position: Position,
    type: WorkStationType
}

/**
 * information about each cake layer
 */
export interface CakeLayer {
    recipe: {
        [key in IngredientType]?: number
    },
    color?: string,
}

export interface Syrup {
    height: number,
    velocity: number
}

/**
 * what each client needs to know about the game state
 */
export interface GameState {
    ingredients: Ingredient[],  // where and what ingredients are on the field
    players: Record<string, Player>,          // information about each player, each index is the player number
    cake: CakeLayer[],          // what has already been built
    syrup: Syrup,               // syrup hazard information
    currentRecipe: CakeLayer,   // what is currently being built
    score: number,              // score
    highScore: number,          // best score of the session
    lastIngredientSpawnTime: number,    // the last time an ingredient spawned
    ingredientSpawnInterval: number,    // how long between ingredient spawn times
    currentCakeLayer: CakeLayer,        // what the current layer looks like
}


export type GameActions = {
    playerMove: (position: Position) => void
}