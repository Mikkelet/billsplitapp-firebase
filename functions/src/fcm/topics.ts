/**
 * gets generated topic
 * @param {string} userId
 * @return {string} generated topic for user
 */
export function getTopicForUser(userId: string): string {
    return `user-${userId}`
}