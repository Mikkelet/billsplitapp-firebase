import { Request, Response } from "firebase-functions";
import { getEvents } from "../collections/events-collection";
import { getGroupById } from "../collections/group-collection";
import { getPeople } from "../collections/user-collection";
import { convertEventToDTO, EventDTO } from "../interfaces/dto/event-dto";
import { GetEventsRequest, GetEventsResponse } from "../interfaces/get-events";
import { Event } from "../interfaces/models/events";

export const getEventsImpl = async (req: Request, res: Response) => {
    const body = req.body as GetEventsRequest;
    console.log("request", body);

    const groupId = body.groupId;

    try {
        const group = await getGroupById(groupId);
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
        console.error(e);
        res.status(500).send(e);
    }
}