import { Event, ExpenseEvent } from "../../interfaces/models/events";
import { EventV4 } from "../models/event/event_v4";
import { ExpenseEventV3 } from "../models/expense/expense_v3";

/**
 * convert V2 to V3
 * @param {ExpenseEventV4 | PaymentEvent | null} event expense
 * @return {Event | null } expense
 */
export function convertEventV4ToV5(event: EventV4 | null):
    Event | null {
    if (event === undefined) return null;
    if (event === null) return null;
    if (event.type === "payment") return event;
    return convertExpense(event)
}

/**
 * Convert event
 * @param {ExpenseEventV3} event expense event
 * @return {ExpenseEventV4}
 */
function convertExpense(event: ExpenseEventV3): ExpenseEvent {
    return {
        createdBy: event.createdBy,
        currency: event.currency,
        description: event.description,
        id: event.id,
        payee: event.payee,
        receiptImageUrl: "",
        sharedExpenses: event.sharedExpenses,
        timestamp: event.timestamp,
        type: event.type,
        tempParticipants: [],
    }
}