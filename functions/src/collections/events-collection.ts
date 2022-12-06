import { Event } from "../interfaces/models/events";
import { groupCollection } from "./group-collection";

const eventsCollection = (groupId: string) =>
    groupCollection.doc(groupId).collection("events");

/**
 * Get events related to group
 * @param {string} groupId id of events
 * @param {Person[]} people in group
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
 * Add a new event
 * @param {string} groupId id of group to add event to
 * @param {Event} event event to add
 * @return {Event} event with new ID
 */
export async function addEvent(groupId: string, event: Event): Promise<Event> {
    const eventId = eventsCollection(groupId).doc().id
    event.id = eventId;
    await eventsCollection(groupId).doc(eventId).set(event);
    return event;
}