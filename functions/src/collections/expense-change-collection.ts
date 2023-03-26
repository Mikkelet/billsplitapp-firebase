import { ExpenseChangeEvent } from "../interfaces/models/events";
import { eventsCollection } from "./events-collection";

const expenseChangesCollection = (groupId: string, eventId: string) =>
    eventsCollection(groupId).doc(eventId).collection("changes")

/**
 * @param {string} groupId id of group of event
 * @param {ExpenseChangeEvent} expenseChange change event to add
 * @return {Promise<ExpenseChangeEvent>} event with new id
 */
export async function addChange(groupId: string, expenseChange: ExpenseChangeEvent): Promise<ExpenseChangeEvent> {
    const response = await expenseChangesCollection(groupId, expenseChange.groupExpenseOriginal.id).add(expenseChange)
    expenseChange.id = response.id
    return expenseChange
}