import { Request, Response } from "firebase-functions";
import { convertGroupToDTO } from "../interfaces/dto/group-dto";
import { GetGroupResponse } from "../interfaces/get-group";
import { getGroupById } from "../collections/group-collection";
import { getEvents } from "../collections/events-collection";
import { convertEventToDTO, EventDTO } from "../interfaces/dto/event-dto";
import { getPeople } from "../collections/user-collection";
import { Event, ExpenseEvent } from "../interfaces/models/events";
import { Group } from "../interfaces/models/group";
import { Person, PersonWithId } from "../interfaces/models/person";
import { ServiceDTO } from "../interfaces/dto/service-dto";
import { convertServiceToDTO, Service } from "../interfaces/models/service";
import { getServicesForGroup } from "../collections/services-collection";
import { handleError } from "../utils/error-utils";
import validateUserMembership from "../middleware/validate-user-membership";
import logRequest from "../utils/log-utils";
import TempParticipant from "../interfaces/models/temp-participant";

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
        const temps: TempParticipant[] = events
            .filter((event) => event.type === "expense")
            .map((event) => (event as ExpenseEvent).tempParticipants)
            .flat()

        const usersAndTemps: PersonWithId[] = [...people, ...temps]
        console.log(usersAndTemps);
        const groupDto = convertGroupToDTO(group, usersAndTemps);
        const eventDTOs: EventDTO[] = events.map((event) =>
            convertEventToDTO(event, usersAndTemps))
        const serviceDTOs: ServiceDTO[] = services.map((service) =>
            convertServiceToDTO(service, usersAndTemps))

        const response: GetGroupResponse = {
            group: groupDto,
            events: eventDTOs,
            services: serviceDTOs,
        }
        console.log("response", JSON.stringify(response));
        res.status(200).send(response);
    } catch (e) {
        handleError(e, res)
    }
}

export default getGroupImpl