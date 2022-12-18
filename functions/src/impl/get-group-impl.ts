import { Request, Response } from "firebase-functions";
import { convertGroupToDTO } from "../interfaces/dto/group-dto";
import { GetGroupRequest, GetGroupResponse } from "../interfaces/get-group";
import { getGroupById } from "../collections/group-collection";
import { getEvents } from "../collections/events-collection";
import { convertEventToDTO, EventDTO } from "../interfaces/dto/event-dto";
import { getPeople } from "../collections/user-collection";
import { Event } from "../interfaces/models/events";
import { Group } from "../interfaces/models/group";
import { Person } from "../interfaces/models/person";
import { verifyUser } from "../auth";

export const getGroupImpl = async (req: Request, res: Response) => {
    const body = req.body as GetGroupRequest;
    const groupId = body.groupId as string;
    console.log("request", body);

    const uid = await verifyUser(req.headers.authorization)
    if (uid === null) {
        res.status(403).send("Unauthorized");
        return
    }

    try {
        const group: Group = await getGroupById(groupId);

        if (group.people.find((user) => user === uid) === undefined) {
            console.log("Token userid not found in group", { groupId: groupId, uid: uid });
            res.status(404).send("Could not find group")
            return
        }

        const people: Person[] = await getPeople(group.people);
        const events: Event[] = await getEvents(groupId);

        const groupDto = convertGroupToDTO(group, people);
        const eventDTOs: EventDTO[] = events.map((event) => convertEventToDTO(event, people))

        const response: GetGroupResponse = {
            group: groupDto,
            events: eventDTOs,
        }
        console.log("response", response);
        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}