import { Request, Response } from "firebase-functions";
import { addEvent, updateExpense } from "../collections/events-collection";
import { AddEventRequest, AddEventResponse } from "../interfaces/add-event";
import { EventDTO, ExpenseChangeEventDTO } from "../interfaces/dto/event-dto";
import { convertDTOtoEvent, Event, ExpenseEvent } from "../interfaces/models/events";

export const addEventImpl = async (req: Request, res: Response) => {
    const body = req.body as AddEventRequest;
    console.log("request", body);

    const groupId = body.groupId
    const eventDTO: EventDTO = body.event;
    const event: Event = convertDTOtoEvent(eventDTO);

    try {
        if (eventDTO.type === "change") {
            const updatedExpenseDTO = (eventDTO as ExpenseChangeEventDTO).groupExpenseEdited;
            const updatedExpense: ExpenseEvent =
                convertDTOtoEvent(updatedExpenseDTO) as ExpenseEvent;
            await updateExpense(groupId, updatedExpense);
        }
        const dbEvent = await addEvent(groupId, event)
        eventDTO.id = dbEvent.id

        const response: AddEventResponse = { event: eventDTO }
        console.log("response", eventDTO);
        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}