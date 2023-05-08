import { Request, Response } from "firebase-functions";
import { convertGroupToDTO } from "../interfaces/dto/group-dto";
import { GetGroupResponse } from "../interfaces/get-group";
import { getGroupById } from "../collections/group-collection";
import { getEvents } from "../collections/events-collection";
import { convertEventToDTO, EventDTO } from "../interfaces/dto/event-dto";
import { getPeople } from "../collections/user-collection";
import { Event } from "../interfaces/models/events";
import { Group } from "../interfaces/models/group";
import { Person } from "../interfaces/models/person";
import { ServiceDTO } from "../interfaces/dto/service-dto";
import { convertServiceToDTO, Service } from "../interfaces/models/service";
import { getServicesForGroup } from "../collections/services-collection";
import { handleError } from "../utils/error-utils";
import validateUserMembership from "../middleware/validate-user-membership";
import logRequest from "../utils/log-utils";

const getGroupImpl = async (req: Request, res: Response, uid: string) => {
    logRequest(req)
    const body = req.params.id
    const groupId = body

    try {
        const group: Group = await getGroupById(groupId);
        validateUserMembership(uid, group)


        const uids: string[] = [...group.pastMembers, ...group.people]
        const people: Person[] = await getPeople(uids);
        const events: Event[] = await getEvents(groupId);
        const services: Service[] = await getServicesForGroup(groupId);

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
        handleError(e, res)
    }
}

export default getGroupImpl