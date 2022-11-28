import { Request, Response } from "firebase-functions";
import { eventsCollection } from "../collections";
import GetEventsRequest from "../interfaces/get-events-request";

export const getEventsImpl = async (req: Request, res: Response) => {
    const body = req.body as GetEventsRequest;
    console.log(body);
    const groupId = body.groupId;

    try {
        const data = await eventsCollection(groupId).get();
        const docData = data.docs.map((doc) => doc.data());
        res.status(200).send(docData);
    } catch (e) {
        console.error(e);
        res.send(500).send(e);
    }
}
