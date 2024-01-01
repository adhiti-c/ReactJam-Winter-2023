
export const Ingredients = ["eggs", "butter", "sugar", "flour"] as const;

/**
 * an atomic ingredient that combines to make a cake component
 */
export type IngredientType = typeof Ingredients[number]


export const Flavors = ["strawberry", "chocolate", "carrot"] as const;

export const AllInventory = [...Ingredients, ...Flavors];

/**
 * a flavor variation that is added to a completed cake base and frosting
 */
export type FlavorType = typeof Flavors[number];

/**
 * Possible blocks that the player can put down. Effectively what lies in the player's inventory
 */
export type PlacableIngredient = IngredientType | FlavorType

/**
 * These are cake steps that the players may be asked to build
 */
export const Goals = ["cake_base", "cake_frosting", "basic_cake", "choco_cake", "straw_cake", "carrot_cake"] as const;

/**
 * These are non-atomic cake layers that make up PlacableIngredient or other non-atomic cake layers
 */
export type GoalType = typeof Goals[number]
/**
 * What can be rendered in the cake layers in the game. May be an inventory ingredient or a finished cake
 */
export type CakeLayerType = GoalType | PlacableIngredient;

/**
 * this is an alias type for readability. This refers to what can go into 
 */
export type RecipeComponent = CakeLayerType

export interface Recipe {
    recipe: RecipeComponent[],
    ordered: boolean
}

// when we add more cake varieties, add them here

/**
 * a dictionary of possible cake goals and how to build them. If it is a set, component order does not matter. If it is an array, order does matter!
 * Typically, if it is a set, we will be relying on what has already been placed and additional ingredients that have been placed.
 */
export const RecipeBook: Record<GoalType, Recipe> = {
    "cake_base": {
        recipe: ["eggs", "flour"],
        ordered: false
    },
    "cake_frosting": {
        recipe: ["butter", "sugar"],
        ordered: false
    },
    "basic_cake": {
        recipe: ["cake_base", "cake_frosting"],
        ordered: true,
    },
    "choco_cake": {
        recipe: ["basic_cake", "chocolate"],
        ordered: true,
    },
    "straw_cake": {
        recipe: ["basic_cake", "strawberry"],
        ordered: true,
    },
    "carrot_cake": {
        recipe: ["basic_cake", "carrot"],
        ordered: true,
    }
}