import { Event, ExpenseEvent } from "../interfaces/models/events";
import { groupCollection } from "./group-collection";

const eventsCollection = (groupId: string) =>
    groupCollection.doc(groupId).collection("events");

/**
 * Get events related to group
 * @param {string} groupId id of events
 * @return {Promise<Event[]>} events related to the group
 */
export async function getEvents(groupId: string): Promise<Event[]> {
    const query = await eventsCollection(groupId).get()
    const events: Event[] = query.docs.map((doc) => doc.data() as Event)
    return events;
}

/**
 * Update an expense with new values
 * @param {string} groupId group of event
 * @param {ExpenseEvent} expenseEvent expense to be updated
 */
export async function updateExpense(groupId: string, expenseEvent: ExpenseEvent) {
    return eventsCollection(groupId).doc(expenseEvent.id).update(expenseEvent);
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

/**
 * Checks if an events exists
 * @param {string} groupId id of group with event
 * @param {string} eventId id of event
 * @return {Promise<boolean>} true if event exists
 */
export async function eventExists(groupId: string, eventId: string): Promise<boolean> {
    const query = await eventsCollection(groupId).doc(eventId).get()
    return query.exists
}

/**
 * Deletes an event
 * @param {string} groupId id of group with event
 * @param {string} eventId id of event
 */
export async function deleteEvent(groupId: string, eventId: string) {
    await eventsCollection(groupId).doc(eventId).delete()
}

