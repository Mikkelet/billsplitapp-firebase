import { Request, Response } from "firebase-functions";
import { eventsCollection, groupCollection, userDoc } from "../collections";
import GetGroupRequest from "../interfaces/get-group-request";
import GetGroupResponse from "../interfaces/get-group-response";
import { Event, ExpenseEvent } from "../interfaces/models/events";
import Group from "../interfaces/models/group";
import Person from "../interfaces/models/person";

export const getGroupImpl = async (req: Request, res: Response) => {
    const body = req.body as GetGroupRequest;
    const groupId = body.groupId as string;
    console.log(body);

    try {
        const group = await getGroup(groupId)
        const people = await getPeople(group.people)
        const events = await getEvents(groupId)
        const response: GetGroupResponse = {
            group: group,
            people: people,
            events: events,
        }
        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        res.send(500).send(e);
    }
}

/**
 * Request and returns a group, throws error if unsuccesful
 * @param {string} groupId of group
 * @return {Promise<Group>} Group object
 */
async function getGroup(groupId: string): Promise<Group> {
    try {
        const query = await groupCollection.doc(groupId).get()
        const groupData = query.data() as Group
        groupData.id = query.id
        return groupData
    } catch (e) {
        console.error(e);
        throw e;
    }
}

/**
 * Get events related to group
 * @param {string} groupId id of events
 * @return {Promise<Event[]>} events related to the group
 */
async function getEvents(groupId: string): Promise<Event[]> {
    try {
        const query = await eventsCollection(groupId).get()
        const eventData = query.docs.map((doc) => {
            const event = doc.data() as Event;
            if (event.eventType === "expense") {
                (event as ExpenseEvent).id = doc.id;
            }
            return event;
        })
        return eventData
    } catch (e) {
        console.error(e);
        throw e;
    }
}

/**
 * Get people related to group
 * @param {string[]} uids of people uids
 * @return {Promise<Person[]>} list of people objects
 */
async function getPeople(uids: string[]): Promise<Person[]> {
    return [
        {
            id: "person_0",
            name: "mikkek",
            pfpUrl: "",
        }, {
            id: "person_1",
            name: "Tobis",
            pfpUrl: "",
        }, {
            id: "person_2",
            name: "Rsuma",
            pfpUrl: "",
        },
    ]
    const users: Person[] = []

    uids.forEach(async (uid) => {
        try {
            const doc = await userDoc(uid).get();
            const data = doc.data() as Person;
            users.push(data);
        } catch (e) {
            console.error(e);
            throw e;
        }
    })
    return users;
}