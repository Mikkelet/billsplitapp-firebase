import { Request, Response } from "firebase-functions";
import { getEvents } from "../collections/events-collection";
import { getGroupById } from "../collections/group-collection";
import { getPeople } from "../collections/user-collection";
import { convertEventToDTO, EventDTO } from "../interfaces/dto/event-dto";
import { GetEventsRequest, GetEventsResponse } from "../interfaces/get-events";
import { Event, ExpenseEvent } from "../interfaces/models/events";
import { handleError } from "../utils/error-utils";
import validateUserMembership from "../middleware/validators/validate-user-membership";
import logRequest from "../utils/log-utils";
import { Person, PersonWithId } from "../interfaces/models/person";
import TempParticipant from "../interfaces/models/temp-participant";
import { Group } from "../interfaces/models/group";
import { Service, convertServiceToDTO } from "../interfaces/models/service";
import { getServicesForGroup } from "../collections/services-collection";
import { ServiceDTO } from "../interfaces/dto/service-dto";

/**
 * DEPRECATED
 * Get events
 * @param {Request} req request
 * @param {Response} res response
 * @param {string} uid user id
 */
const getEventsImpl = async (req: Request, res: Response, uid: string) => {
    logRequest(req)
    const params = req.params as unknown as GetEventsRequest
    const groupId = params.groupId;

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
        const eventDTOs: EventDTO[] = events.map((event) =>
            convertEventToDTO(event, usersAndTemps))
        const serviceDTOs: ServiceDTO[] = services.map((service) =>
            convertServiceToDTO(service, usersAndTemps))


        const response: GetEventsResponse = {
            events: eventDTOs,
            services: serviceDTOs,
        }
        console.log("response", JSON.stringify(response));
        res.status(200).send(response);
    } catch (e) {
        handleError(e, res)
    }
}

export default getEventsImpl