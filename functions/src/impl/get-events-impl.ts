import { Request, Response } from "firebase-functions";
import { getEvents } from "../collections/events-collection";
import { getGroupById } from "../collections/group-collection";
import { getPeople } from "../collections/user-collection";
import { convertEventToDTO, EventDTO } from "../interfaces/dto/event-dto";
import { GetEventsRequest, GetEventsResponse } from "../interfaces/get-events";
import { Event, ExpenseEvent } from "../interfaces/models/events";
import { handleError } from "../utils/error-utils";
import validateUserMembership from "../middleware/validate-user-membership";
import logRequest from "../utils/log-utils";
import { Person, PersonWithId } from "../interfaces/models/person";
import TempParticipant from "../interfaces/models/temp-participant";

/**
 * DEPRECATED
 */
const getEventsImpl = async (req: Request, res: Response, uid: string) => {
    logRequest(req)
    const body = req.body as GetEventsRequest;
    const groupId = body.groupId;

    try {
        const group = await getGroupById(groupId);
        validateUserMembership(uid, group)

        const people: Person[] = await getPeople(group.people);
        const events: Event[] = await getEvents(groupId);
        const temps: TempParticipant[] = events
            .filter((event) => event.type === "expense")
            .map((event) => (event as ExpenseEvent).tempParticipants)
            .flat()

        const usersAndTemps: PersonWithId[] = [...people, ...temps]
        const dtos: EventDTO[] = events.map((event) => {
            return convertEventToDTO(event, usersAndTemps)
        })


        const response: GetEventsResponse = {
            events: dtos,
        }
        console.log("response", JSON.stringify(response));
        res.status(200).send(response);
    } catch (e) {
        handleError(e, res)
    }
}

export default getEventsImpl