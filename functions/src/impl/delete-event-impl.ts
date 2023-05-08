import { Request, Response } from "firebase-functions";
import { deleteEvent, eventExists } from "../collections/events-collection";
import { getGroupById, updateGroupDebt } from "../collections/group-collection";
import logRequest from "../utils/log-utils";
import { billSplitError, handleError } from "../utils/error-utils";
import { DeleteEventRequest } from "../interfaces/delete-event";

export const deleteEventImpl = async (req: Request, res: Response, uid: string) => {
    logRequest(req)

    try {
        const groupId = req.params.groupId
        const eventId = req.params.eventId
        const debts = (req.body as DeleteEventRequest).debts

        const eventExist = await eventExists(groupId, eventId)
        if (!eventExist) {
            throw billSplitError(404, "event does not exist, or has already been deleted")
        }

        const group = await getGroupById(groupId)
        const findUser = group.people.find((id) => id === uid)
        if (findUser === undefined) throw Error("User is not part of this group")
        await deleteEvent(groupId, eventId)
        await updateGroupDebt(groupId, debts, null)
        res.status(204).send()
    } catch (e) {
        handleError(e, res)
    }
}