

export interface Position {
    x: number,
    y: number,
    z: number,
    // rotation: number
}

export interface Player {
    id: string,     // the rune id
    position: Position,
    number: number  // the index of the array in the game state logic
}

export type IngredientType = "eggs" | "milk" | "butter" | "sugar" | "flour"

export interface Ingredient {
    position: Position,
    type: IngredientType,
}

/**
 * information about each cake layer
 */
export interface CakeLayer {
    recipe: {
        [key in IngredientType]?: number
    },
    color: string,
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
    players: Player[],          // information about each player, each index is the player number
    cake: CakeLayer[],          // what has already been built
    syrup: Syrup,               // syrup hazard information
    currentRecipe: CakeLayer,   // what is currently being built
    score: number,              // score
    highScore: number,          // best score of the session
}
