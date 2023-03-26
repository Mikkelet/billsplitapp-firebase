import { Request, Response } from "firebase-functions";
import { deleteEvent, eventExists } from "../collections/events-collection";
import { getGroupById, updateGroupDebt } from "../collections/group-collection";
import { DeleteEventRequest } from "../interfaces/delete-event";

export const deleteEventImpl = async (req: Request, res: Response, uid: string) => {
    const body = req.body as DeleteEventRequest
    const groupId = body.groupId
    const eventId = body.event.id
    console.log(body);
    
    const eventExist = await eventExists(groupId, eventId)
    if (!eventExist) {
        res.status(404).send("event does not exist, or has already been deleted")
        return
    }

    try {
        const group = await getGroupById(groupId)
        const findUser = group.people.find((id) => id === uid)
        if (findUser === undefined) throw Error("User is not part of this group")
        await deleteEvent(groupId, eventId)
        await updateGroupDebt(groupId, body.debts, null)
        res.status(200).send()
    } catch (e) {
        res.status(500).send(e)
    }
}