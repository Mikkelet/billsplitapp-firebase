import { Request, Response } from "firebase-functions";
import { eventsCollection } from "../collections";
import AddEvent from "../interfaces/add-event-request";

export const addEventImpl = async (req: Request, res: Response) => {
    const body = req.body as AddEvent;
    const event = body.event;

    try {
        await eventsCollection(body.groupId).add(event);
        res.status(200).send();
    } catch (e) {
        res.send(500).send(e);
    }
}