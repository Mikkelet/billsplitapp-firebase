/**
 * removes item from array
 * @param {T[]} array array
 * @param {T} item item to be removed from array
 * @return {T[]} array without item
 */
export function removeFromArray<T>(array: T[], item: T): T[] {
    const index = array.indexOf(item);
    if (index > -1) {
        array.splice(index, 1);
    }
    return array
}

/**
 * Checks if array contains item
 * @param {T[]} array arry
 * @param {T} item item
 * @return {boolean} return true if item is in array
 */
export function arrayContains<T>(array: T[], item: T): boolean {
    const index = array.indexOf(item);
    return index > -1
}