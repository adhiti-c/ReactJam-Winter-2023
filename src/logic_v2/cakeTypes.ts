/**
 * this file handles all the cake game specific types in the game states and mechanics, including:
    - what ingredients players have (Ingredients)
    - what flavors of cake (Flavors)
    - what players may be asked to build for an increase in score (Goals)
    - how to build each goal (RecipeBook)
 */


// <------------------- things we could edit to expand the game -------------------->
/**
 * available ingredients
 */
export const Ingredients = ["eggs", "butter", "sugar", "flour"] as const;

/**
 * an atomic ingredient that combines to make a cake component
 */
export type IngredientType = (typeof Ingredients)[number];

/**
 * available flavor types
 */
export const Flavors = ["strawberry", "chocolate", "carrot"] as const;


// when we add more cake varieties, add them to the goals and the recipe book

/**
 * These are cake steps that the players may be asked to build to increase score
 */
export const Goals = [
    "cake_base",
    "cake_frosting",
    "basic_cake",
    "choco_cake",
    "straw_cake",
    "carrot_cake",
] as const;

/**
 * a dictionary of possible cake goals and how to build them
 * if the recipe is ordered, order matters! This is espcially useful if we are doing combinations, where the components must be built in a specific order
 * for example, a choco_cake is ordered because first, a cake_base must be built. Then, a cake_frosting. These combine into a "basic_cake" which you then add chocolate to, to turn it into a choco_cake!
 * order matters, there.
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

// <----------- generally, do not touch these ------------------>

/**
 * a flavor variation that is added to a completed cake base and frosting
*/
export type FlavorType = typeof Flavors[number];

/**
 * these are all the possible things a player can see in their inventory, in an array format. Mostly used in the frontend for the inventory
 */
export const AllInventory = [...Ingredients, ...Flavors];

/**
 * Possible blocks that the player can put down. Effectively what lies in the player's inventory also, but this time it's a type
 */
export type PlacableIngredient = IngredientType | FlavorType

// PlacableIngredient type guard
export function isPlacableIngredient(value: any): value is PlacableIngredient {
    return AllInventory.includes(value);
}

/**
 * These are non-atomic cake layers that make up PlacableIngredient or other non-atomic cake layers
 */
export type GoalType = typeof Goals[number];

/**
 * What can be rendered in the cake layers in the game. May be an inventory ingredient or a finished cake
 */
export type CakeLayerType = GoalType | PlacableIngredient;

/**
 * this is an alias type for readability. This refers to what you'd use to combine into the recipe
 */
export type RecipeComponent = CakeLayerType

export interface Recipe {
    recipe: RecipeComponent[],
    ordered: boolean
}
