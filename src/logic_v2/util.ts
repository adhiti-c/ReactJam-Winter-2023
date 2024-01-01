import util from "util";
/**
 * function to check if two sets are equivalent
 * @param set1 
 * @param set2 
 */
export function checkSetEquivalency(set1: Set<any>, set2: Set<any>): boolean {
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
 * @param arr1 
 * @param arr2 
 * @returns 
 */
export function checkArrayDeepEquality(arr1: any[], arr2: any[]): boolean {
    if (arr1.length !== arr2.length) {
        return false;
    }
    return util.isDeepStrictEqual(arr1, arr2);
}

export function chooseRandomIndexOfArray(array: any[]): number {
    if (array.length === 0) {
        throw new Error('Array is empty');
    }

    return Math.floor(Math.random() * array.length);
}