/**
 * function to check if two sets are equivalent
 * @param set1 
 * @param set2 
 */
export function compareArraysAsSets(arr1: any[], arr2: any[]): boolean {
    // check if same length
    if (arr1.length != arr2.length) {
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
 * @returns 
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
        throw new Error('Array is empty');
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