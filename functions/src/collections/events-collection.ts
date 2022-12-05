import { convertEventToDTO, EventDTO } from "../interfaces/dto/event-dto";
import { Event } from "../interfaces/models/events";
import Person from "../interfaces/models/person";
import { groupCollection } from "./group-collection";

export const eventsCollection = (groupId: string) =>
    groupCollection.doc(groupId).collection("events");

/**
 * Get events related to group
 * @param {string} groupId id of events
 * @param {Person[]} people in group
 * @return {Promise<Event[]>} events related to the group
 */
export async function getEvents(
    groupId: string,
    people: Person[]
): Promise<EventDTO[]> {
    try {
        const query = await eventsCollection(groupId).get()
        const eventData = query.docs.map((doc) => {
            const event = doc.data() as Event;
            const eventDTO = convertEventToDTO(event, people)
            eventDTO.id = doc.id;
            return eventDTO;
        })
        return eventData;
    } catch (e) {
        console.error(e);
        throw e;
    }
}