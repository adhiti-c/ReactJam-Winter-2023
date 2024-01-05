import { CakeLayerType, GoalType, PlacableIngredient, Recipe, RecipeBook, RecipeComponent } from "./cakeTypes";
import { Player } from "./types";

/**
 * function to check if two sets are equivalent
 * @param set1
 * @param set2
 */
export function compareArraysAsSets(arr1: any[], arr2: any[]): boolean {
    // check if same length
    if (arr1.length !== arr2.length) {
        return false;
    }
    // turn both into sets
    const set1 = new Set(arr1);
    const set2 = new Set(arr2)

    // compare sets now
    if (set1.size !== set2.size) {
        return false;
    }

    for (const item of set1) {
        if (!set2.has(item)) {
            return false;
        }
    }

    return true;
}

/**
 * Function to check if two arrays are equal
 * Note: vite does not support util.isDeepEquals
 * @param arr1
 * @param arr2
/**
 * @returns {boolean}
 */
export function compareArraysInOrder(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) {
        return false;
    }
    // note: this does not do a deep object equality!
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    return true;
}

export function chooseRandomIndexOfArray(array: any[]): number {
    if (array.length === 0) {
        throw new Error("Array is empty");
    }

    return Math.floor(Math.random() * array.length);
}

/**
 * removes an item from the array and returns a copy of the array
 * @param array
 * @param value
 * @returns
 */
export function removeFromArray<T>(array: T[], value: T): T[] {
    const index = array.indexOf(value);
    if (index > -1) { // only splice array when item is found
        array.splice(index, 1); // 2nd parameter means remove one item only
    }
    return array;
}

/**
 * recursive function to check if we are making progress toward the goal
 * assumes that all combining has been done, if possible
 * @param goal 
 * @param layers 
 * @returns 
 */
export function checkProgress(goal: RecipeComponent, layers: CakeLayerType[]): boolean {
    // base case
    // check if current goal is not in the recipe book
    const possibleGoal = goal as GoalType
    const recipe = RecipeBook[possibleGoal]
    // this may not be found
    if (!recipe) {
        return false;
    }

    // check if our layer is literally just the goal
    if (layers.length === 1 && layers[0] === goal) {
        return true;
    }

    // recursion now
    if (recipe.ordered) {
        // do 1-1 comparison
        for (const [index, layer] of layers.entries()) {
            const currentComponent = recipe.recipe[index]
            if (layer !== currentComponent) {
                // slice new layer to match
                const layerSliced = layers.slice(index);
                // recursively call the function
                return checkProgress(currentComponent, layerSliced);
            }
        }
    } else {
        // turn recipe into a set
        const recipeSet = new Set(recipe.recipe);
        for (const [index, layer] of layers.entries()) {
            // check if the current thing in the layer is in the set
            if (!recipeSet.has(layer)) {
                // we could not find this current thing, but it may be a smaller part of another ingredient in the set
                // slice new layer to match
                const layerSliced = layers.slice(index);
                // check each part of the set
                for (const component of recipeSet.values()) {
                    // recursively call, check if this thing is making progress
                    const progress = checkProgress(component, layerSliced)
                    if (!progress) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    // the entire recipe is in line so far
    return true;
}

export function matchRecipe(layers: CakeLayerType[]) {
    let created: GoalType | null = null;
    // look through the recipe book to find a match
    for (const goal in RecipeBook) {
        // check this recipe
        const goalType = goal as GoalType
        const recipe = RecipeBook[goalType];
        let res = false;
        if (recipe.ordered) {
            // deep equality
            res = compareArraysInOrder(recipe.recipe, layers);
        } else {
            // consider it like an unordered set
            res = compareArraysAsSets(recipe.recipe, layers);
        }
        // is there a match?
        if (res) {
            created = goalType;
            break;
        }
    }
    return created;
}

/**
 * function to combine layers in a sliding window algorithm, from the top to the bottom
 * @param layer 
 * @returns 
 */
export function combineLayer(layer: CakeLayerType[]): CakeLayerType[] {
    let combinedLayer = [...layer];
    let r = combinedLayer.length - 1
    let l = r - 1

    while (l >= 0) {
        // create an array that is just layer[l] and layer[r] to put into matchRecipe
        let matchArray: CakeLayerType[] = combinedLayer.slice(l, r + 1)

        // parameter to put into matchRecipe
        let match = matchRecipe(matchArray)
        // if the match array gets a valid match
        // get rid of the current l,r pointer we are on and add the match
        if (match !== null) {
            // add the item that is matched to where the l index was
            combinedLayer.splice(l, 0, match)

            // get rid of the items that just got matched
            combinedLayer.splice(r + 1, r + 1)
            combinedLayer.splice(l + 1, l + 1)

            // decrement the window
            l--
            r--
        }
        // there is no valid match, move up the pointers
        else {
            l--
            r--
        }
    }
    return combinedLayer;
}

export function giveAllPlayersRandomly(players: Record<string, Player>, ingredients: PlacableIngredient[]): Record<string, Player> {
    for (const playerId in players) {
        // choose random
        const index = chooseRandomIndexOfArray(ingredients);
        // get the ingredient
        const ingredientInventory = ingredients.splice(index, 1);
        const currentInventory = players[playerId].inventory
        // create player
        players[playerId].inventory = [...currentInventory].concat(ingredientInventory)
    }
    return players;
}