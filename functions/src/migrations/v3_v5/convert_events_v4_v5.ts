import { PaymentEvent, Event } from "../../interfaces/models/events";
import { ExpenseEventV3 } from "../models/event_v3";
import { EventV4 } from "../models/event_v4";

export type EventV3 = ExpenseEventV3 | PaymentEvent | null

/**
 * convert V2 to V3
 * @param {ExpenseEventV3 | PaymentEvent | null} event expense
 * @return {Event | null } expense
 */
export function convertEventV4ToV5(event: EventV4 | null):
    Event | null {
    if (event === undefined) return null;
    if (event === null) return null;
    if (event.type === "payment") return event as PaymentEvent
    if (event.timestamp === undefined) console.log(event.id);

    return {
        ...event,
        tempParticipants: [],
    }
}