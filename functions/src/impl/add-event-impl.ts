import { Request, Response } from "firebase-functions";
import { insertEvent, updateExpense } from "../collections/events-collection";
import { getGroupById, updateGroupDebt } from "../collections/group-collection";
import { AddEventRequest, AddEventResponse } from "../interfaces/add-event";
import { EventDTO, ExpenseChangeEventDTO } from "../interfaces/dto/event-dto";
import { convertDTOtoDebt, Debt } from "../interfaces/models/debt";
import { convertDTOtoEvent, Event, ExpenseEvent } from "../interfaces/models/events";
import { Group } from "../interfaces/models/group";
import { handleError } from "../utils/error-utils";
import { validateUserMembership } from "../middleware/validate-user-membership";
import { validateAddEvent } from "../middleware/validate-add-event";
import logRequest from "../utils/log-utils";

export const addEventImpl = async (req: Request, res: Response, uid: string) => {
    logRequest(req)
    const body = req.body as AddEventRequest;

    try {
        const groupId = body.groupId
        const eventDTO: EventDTO = body.event;
        const debtDtos = body.debts;
        const event: Event = convertDTOtoEvent(uid, eventDTO);
        const debts: Debt[] = debtDtos.map((dto) => convertDTOtoDebt(dto));

        validateAddEvent(body, uid)
        const group: Group = await getGroupById(groupId);
        validateUserMembership(uid, group);

        if (eventDTO.type === "change") {
            const updatedExpenseDTO = (eventDTO as ExpenseChangeEventDTO).groupExpenseEdited;
            const updatedExpense: ExpenseEvent =
                convertDTOtoEvent(uid, updatedExpenseDTO) as ExpenseEvent;
            await updateExpense(groupId, updatedExpense);
        }
        const dbEvent = await insertEvent(groupId, event)
        eventDTO.id = dbEvent.id

        let latestEvent: Event | null = null
        if (group.latestEvent === undefined) {
            latestEvent = event
        } else if (group.latestEvent === null) {
            latestEvent = event
        } else if (event.timeStamp > group.latestEvent.timeStamp) {
            latestEvent = event
        }
        await updateGroupDebt(groupId, debts, latestEvent);

        const response: AddEventResponse = { event: eventDTO }
        console.log("response", eventDTO);
        res.status(200).send(response);
    } catch (e) {
        handleError(e, res)
    }
}