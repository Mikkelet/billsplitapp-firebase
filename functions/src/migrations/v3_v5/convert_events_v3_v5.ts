import { ExpenseEvent, PaymentEvent } from "../../interfaces/models/events";
import { ExpenseEventV3 } from "../models/event_v3";

export type EventV3 = ExpenseEventV3 | PaymentEvent | null

/**
 * convert V2 to V3
 * @param {ExpenseEventV3 | PaymentEvent | null} event expense
 * @return {Event | null } expense
 */
export function convertEventV3ToV5(event: ExpenseEventV3 | PaymentEvent | null):
    ExpenseEvent | PaymentEvent | null {
    if (event === undefined) return null;
    if (event === null) return null;
    if (event.type === "payment") return event as PaymentEvent
    return {
        ...event,
        tempParticipants: [],
    }
}