import { CakeComponent } from "./types";

/**
 * an atomic ingredient that combines to make a cake component
 */
export type IngredientType = "eggs" | "butter" | "sugar" | "flour";


/**
 * a flavor variation that is added to a completed cake base and frosting
 */
export type Flavor = "strawberry" | "chocolate" | "carrot";

// when we add more cake varieties, add them here
const CAKE_BASE: CakeComponent = {
    recipe: new Set(["eggs", "flour"])
}

const CAKE_FROSTING: CakeComponent = {
    recipe: new Set(["butter", "sugar"])
}

const CHOCO_CAKE: CakeComponent = {
    recipe: new Set([])
}

const STRAW_CAKE: CakeComponent = {
    recipe: new Set([])
}

const CARROT_CAKE: CakeComponent = {
    recipe: new Set([])
}


// available recipes in the game and how to make them
export const Recipes: Record<string, CakeComponent> = {
    "CakeBase": CAKE_BASE,
    "CakeFrosting": CAKE_FROSTING,
    "ChocolateCake": CHOCO_CAKE,
    "StrawberryCake": STRAW_CAKE,
    "CarrotCake": CARROT_CAKE
}