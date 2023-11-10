import { EventV4 } from "../models/event/event_v4";
import { EventV5 } from "../models/event/event_v5";
import { ExpenseEventV4 } from "../models/expense/expense_v4";
import { ExpenseEventV5 } from "../models/expense/expense_v5";

/**
 * convert V2 to V3
 * @param {EventV4 | null} event expense
 * @return {EventV5 | null } expense
 */
export function convertEventV4ToV5(event: EventV4 | null):
    EventV5 | null {
    if (event === undefined) return null;
    if (event === null) return null;
    if (event.type === "payment") return event;
    return convertExpense(event)
}

/**
 * Convert event
 * @param {ExpenseEventV4} event expense event
 * @return {ExpenseEventV5}
 */
function convertExpense(event: ExpenseEventV4): ExpenseEventV5 {
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