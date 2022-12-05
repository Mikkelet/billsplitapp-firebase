import { Request, Response } from "firebase-functions";
import { eventsCollection } from "../collections/events-collection";
import AddEventRequest from "../interfaces/add-event";
import { EventDTO } from "../interfaces/dto/event-dto";
import { convertDTOtoEvent } from "../interfaces/models/events";

export const addEventImpl = async (req: Request, res: Response) => {
    const body = req.body as AddEventRequest;
    const groupId = body.groupId
    const eventDTO: EventDTO = body.event;
    const event = convertDTOtoEvent(eventDTO);

    try {
        const eventId = eventsCollection(body.groupId).doc().id
        event.id = eventId;
        await eventsCollection(groupId).doc(eventId).set(event);
        eventDTO.id = eventId;
        console.log("sending", eventDTO);
        res.status(200).send(eventDTO);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}