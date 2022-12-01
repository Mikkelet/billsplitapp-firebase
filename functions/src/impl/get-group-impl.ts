import { Request, Response } from "firebase-functions";
import { eventsCollection, groupCollection } from "../collections";
import { EventDTO, convertEventToDTO } from "../interfaces/dto/event-dto";
import { Event } from "../interfaces/models/events";
import { Group } from "../interfaces/models/group";
import Person from "../interfaces/models/person";
import { findPerson, getPeople } from "../utils";
import { GroupDTO } from "../interfaces/dto/group-dto";
import { GetGroupRequest, GetGroupResponse } from "../interfaces/get-group";

export const getGroupImpl = async (req: Request, res: Response) => {
    const body = req.body as GetGroupRequest;
    const groupId = body.groupId as string;
    console.log(body);

    try {
        const queryDoc = await groupCollection.doc(groupId).get()
        const groupData = queryDoc.data() as Group
        const people = await getPeople(groupData.people)
        const events = await getEvents(groupId, people)
        const groupDto: GroupDTO = {
            id: queryDoc.id,
            name: groupData.name,
            people: people,
            timeStamp: groupData.timeStamp,
            createdBy: findPerson(people, groupData.createdBy),
        };

        const response: GetGroupResponse = {
            group: groupDto,
            events: events,
        }
        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        res.send(500).send(e);
    }
}

/**
 * Get events related to group
 * @param {string} groupId id of events
 * @param {Person[]} people in group
 * @return {Promise<Event[]>} events related to the group
 */
async function getEvents(
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