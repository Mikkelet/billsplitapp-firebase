import { Request, Response } from "firebase-functions";
import { Group } from "../interfaces/models/group";
import { findPerson, getPeople } from "../utils";
import { GroupDTO } from "../interfaces/dto/group-dto";
import { GetGroupRequest, GetGroupResponse } from "../interfaces/get-group";
import { groupCollection } from "../collections/group-collection";
import { getEvents } from "../collections/events-collection";

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