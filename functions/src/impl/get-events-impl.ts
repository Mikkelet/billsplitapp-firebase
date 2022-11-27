import { Request, Response } from "firebase-functions";
import { eventsCollection } from '../collections';
import GetEventsRequest from "../interfaces/get-events-request";

export const addGroupImpl = async (req: Request, res: Response<any>) => {
    const body = req.body as GetEventsRequest
    const groupId = body.groupId

    try {
        const data = await eventsCollection(groupId).get()
        const docData = data.docs.map((doc) => doc.data())
        res.status(200).send(docData)
    } catch (e) {
        res.send(500).send(e)
    }
}