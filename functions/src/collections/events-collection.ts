import { Event, ExpenseEvent } from "../interfaces/models/events";
import { groupCollection } from "./group-collection";

const eventsCollection = (groupId: string) =>
    groupCollection.doc(groupId).collection("events-v2");

/**
 * Get events related to group
 * @param {string} groupId id of events
 * @return {Promise<Event[]>} events related to the group
 */
export async function getEvents(groupId: string): Promise<Event[]> {
    try {
        const query = await eventsCollection(groupId).get()
        const events: Event[] = query.docs.map((doc) => doc.data() as Event)
        return events;
    } catch (e) {
        console.error(e);
        throw e;
    }
}

/**
 * Update an expense with new values
 * @param {string} groupId group of event
 * @param {ExpenseEvent} expenseEvent expense to be updated
 */
export async function updateExpense(groupId: string, expenseEvent: ExpenseEvent) {
    return eventsCollection(groupId).doc(expenseEvent.id).set(expenseEvent);
}

/**
 * Add or update a new event
 * @param {string} groupId id of group to add event to
 * @param {Event} event event to add
 * @return {Event} event with new ID
 */
export async function insertEvent(groupId: string, event: Event): Promise<Event> {
    if (event.id === undefined || event.id === "") {
        const eventId = eventsCollection(groupId).doc().id
        event.id = eventId;
    }
    await eventsCollection(groupId).doc(event.id).set(event);
    return event;
}