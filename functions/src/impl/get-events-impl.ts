import { Request, Response } from "firebase-functions";
import { getEvents } from "../collections/events-collection";
import { getGroupById } from "../collections/group-collection";
import { getPeople } from "../collections/user-collection";
import { convertEventToDTO, EventDTO } from "../interfaces/dto/event-dto";
import { GetEventsRequest, GetEventsResponse } from "../interfaces/get-events";
import { Event } from "../interfaces/models/events";
import { handleError } from "../utils/error-utils";
import validateUserMembership from "../middleware/validate-user-membership";
import logRequest from "../utils/log-utils";

const getEventsImpl = async (req: Request, res: Response, uid: string) => {
    logRequest(req)
    const body = req.body as GetEventsRequest;
    const groupId = body.groupId;

    try {
        const group = await getGroupById(groupId);
        validateUserMembership(uid, group)

        const people = await getPeople(group.people);
        const events: Event[] = await getEvents(groupId)

        const dtos: EventDTO[] = events.map((event) => {
            return convertEventToDTO(event, people)
        })


        const response: GetEventsResponse = {
            events: dtos,
        }
        console.log("response", response);
        res.status(200).send(response);
    } catch (e) {
        handleError(e, res)
    }
}

export default getEventsImpl