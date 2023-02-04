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
import { ServiceDTO } from "../interfaces/dto/service-dto";
import { convertServiceToDTO, Service } from "../interfaces/models/service";
import { getServices } from "../collections/services-collection";

export const getGroupImpl = async (req: Request, res: Response, uid: string) => {
    const body = req.body as GetGroupRequest;
    const groupId = body.groupId as string;
    console.log("request", body);

    try {
        const group: Group = await getGroupById(groupId);

        const findUid: string | undefined = group.people.find((id) => id === uid)
        if (findUid === undefined) {
            console.log("Token userid not found in group", { groupId: groupId, uid: uid });
            res.status(404).send("Could not find group")
            return
        }

        const people: Person[] = await getPeople(group.people);
        const events: Event[] = await getEvents(groupId);
        const services: Service[] = await getServices(groupId);

        const groupDto = convertGroupToDTO(group, people);
        const eventDTOs: EventDTO[] = events.map((event) =>
            convertEventToDTO(event, people))
        const serviceDTOs: ServiceDTO[] = services.map((service) =>
            convertServiceToDTO(service, people))

        const response: GetGroupResponse = {
            group: groupDto,
            events: eventDTOs,
            services: serviceDTOs,
        }
        console.log("response", response);
        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}