/**
 * gets generated topic for new expense
 * @param {string} groupId
 * @return {string} generated topic for new expense for group
 */
export function getTopicForNewExpense(groupId: string): string {
    return `group-new-expense-${groupId}`
}

/**
 * gets generated topic for new expense
 * @param {string} groupId
 * @return {string} generated topic for updated-expense for group
 */
export function getTopicForUpdateExpense(groupId: string): string {
    return `group-update-expense-${groupId}`
}

/**
 * gets generated topic
 * @param {string} groupId
 * @return {string} generated topic for new-servce for group
 */
export function getTopicForNewService(groupId: string): string {
    return `group-new-service-${groupId}`
}

/**
 * gets generated topic
 * @param {string} groupId
 * @return {string} generated topic for added-to-group
 */
export function getTopicForAddedToGroup(groupId: string): string {
    return `group-added-${groupId}`
}