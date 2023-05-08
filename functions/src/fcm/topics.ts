export function getTopicForNewExpense(groupId: string): string {
    return `group-new-expense-${groupId}`
}

export function getTopicForUpdateExpense(groupId: string): string {
    return `group-update-expense-${groupId}`
}

export function getTopicForNewService(groupId: string): string {
    return `group-new-service-${groupId}`
}

export function getTopicForAddedToGroup(groupId: string): string {
    return `group-added-${groupId}`
}