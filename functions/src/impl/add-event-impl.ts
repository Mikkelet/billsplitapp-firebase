import { Request, Response } from "firebase-functions";
import { eventsCollection } from "../collections";
import AddEvent from "../interfaces/add-event-request";

export const addEventImpl = async (req: Request, res: Response) => {
    const body = req.body as AddEvent;
    console.log(body);
    const event = body.event;

    try {
        await eventsCollection(body.groupId).add(event);
        res.status(200).send();
    } catch (e) {
        console.error(e);
        res.send(500).send(e);
    }
}