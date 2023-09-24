import { Request, Response } from "firebase-functions";
import { insertEvent, updateExpense } from "../collections/events-collection";
import { getGroupById, updateGroup } from "../collections/group-collection";
import { AddEventRequest, AddEventResponse } from "../interfaces/add-event";
import { EventDTO, ExpenseChangeEventDTO, ExpenseEventDTO, PaymentEventDTO }
    from "../interfaces/dto/event-dto";
import { convertDTOtoEvent, Event, ExpenseEvent } from "../interfaces/models/events";
import { Group } from "../interfaces/models/group";
import { handleError } from "../utils/error-utils";
import validateUserMembership from "../middleware/validate-user-membership";
import logRequest from "../utils/log-utils";
import sendEventAddedNotification from "../fcm/send-add-event-message"
import validateAddEvent from "../middleware/validate-add-event";
import sendPaymentNotification from "../fcm/send-payment-notification";

const addEventImpl = async (req: Request, res: Response, uid: string) => {
    logRequest(req)
    const body = req.body as AddEventRequest;

    try {
        validateAddEvent(body, uid)

        const groupId = body.groupId
        const eventDTO: EventDTO = body.event;
        const event: Event = convertDTOtoEvent(uid, eventDTO);

        const group: Group = await getGroupById(groupId);
        validateUserMembership(uid, group);

        if (eventDTO.type === "change") {
            const updatedExpenseDTO = (eventDTO as ExpenseChangeEventDTO).groupExpenseEdited;
            const updatedExpense: ExpenseEvent =
                convertDTOtoEvent(uid, updatedExpenseDTO) as ExpenseEvent;
            await updateExpense(groupId, updatedExpense);
        }
        const dbEvent = await insertEvent(groupId, event)
        if (event.type === "expense") {
            sendEventAddedNotification(uid, group, eventDTO as ExpenseEventDTO)
        } else if (event.type === "payment") {
            sendPaymentNotification(group, eventDTO as PaymentEventDTO)
        }
        eventDTO.id = dbEvent.id

        if (event.type === "expense") {
            if (group.latestEvent === undefined) {
                group.latestEvent = event
            } else if (group.latestEvent === null) {
                group.latestEvent = event
            } else if (event.timestamp > group.latestEvent.timestamp) {
                group.latestEvent = event
            }
            await updateGroup(group)
        }

        const response: AddEventResponse = { event: eventDTO }
        console.log("response", eventDTO);
        res.status(200).send(response);
    } catch (e) {
        handleError(e, res)
    }
}

export default addEventImpl