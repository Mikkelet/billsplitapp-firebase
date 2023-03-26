import { Request, Response } from "firebase-functions";
import { insertEvent, updateExpense } from "../collections/events-collection";
import { getGroupById, updateGroupDebt } from "../collections/group-collection";
import { AddEventRequest, AddEventResponse } from "../interfaces/add-event";
import { EventDTO, ExpenseChangeEventDTO } from "../interfaces/dto/event-dto";
import { convertDTOtoDebt, Debt } from "../interfaces/models/debt";
import { convertDTOtoEvent, Event, ExpenseEvent } from "../interfaces/models/events";
import { Group } from "../interfaces/models/group";

export const addEventImpl = async (req: Request, res: Response, uid: string) => {
    const body = req.body as AddEventRequest;
    console.log("request", body);

    const groupId = body.groupId
    const eventDTO: EventDTO = body.event;
    const debtDtos = body.debts;
    const event: Event = convertDTOtoEvent(uid, eventDTO);
    const debts: Debt[] = debtDtos.map((dto) => convertDTOtoDebt(dto));

    if (debts.length === 0) {
        console.error("Event.debts was empty", { uid: uid, body: body })
        res.status(400).send("An unexptected error occurred. Please contact the developer!")
        return
    }

    if (event.createdBy !== uid) {
        console.error(
            "User trying to create an event on behalf of another user",
            { uid: uid, createdBy: event.createdBy },
        )
        res.status(400).send("Event was not created")
        return
    }

    try {
        const group: Group = await getGroupById(groupId);
        const findUid: string | undefined = group.people.find((id) => id === uid)
        if (findUid === undefined) {
            console.log("Token userid not found in group", { groupId: groupId, uid: uid });
            res.status(404).send("Could not find group")
            return
        }

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
        console.error(e);
        res.status(500).send(e);
    }
}