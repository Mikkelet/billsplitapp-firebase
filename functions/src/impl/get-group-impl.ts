import { Request, Response } from "firebase-functions";
import { eventsCollection, groupCollection, userDoc } from "../collections";
import GetGroupRequest from "../interfaces/get-group-request";
import GetGroupResponse from "../interfaces/get-group-response";
import { Event } from "../interfaces/models/events";
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
            events: events
        }
        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        res.send(500).send(e);
    }
}

async function getGroup(groupId: string): Promise<Group> {
    try {
        const query = await groupCollection.doc(groupId).get()
        const groupData = query.data() as Group
        return groupData
    } catch (e) {
        console.error(e);

        throw e;
    }

}

async function getEvents(groupId: string): Promise<Event[]> {
    try {
        const query = await eventsCollection(groupId).get()
        const eventData = query.docs.map((doc) => doc.data() as Event)
        return eventData
    } catch (e) {
        console.error(e);

        throw e;
    }

}


async function getPeople(uids: string[]): Promise<Person[]> {

    return [
        {
            id: "person_0",
            name: "mikkek",
            pfpUrl: ""
        }, {
            id: "person_1",
            name: "Tobis",
            pfpUrl: ""
        }, {
            id: "person_2",
            name: "Rsuma",
            pfpUrl: ""
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