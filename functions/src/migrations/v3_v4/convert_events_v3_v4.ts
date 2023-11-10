import { EventV3 } from "../models/event/event_v3";
import { EventV4 } from "../models/event/event_v4";
import { ExpenseEventV3 } from "../models/expense/expense_v3";
import { ExpenseEventV4 } from "../models/expense/expense_v4";
import { PaymentEventV3 } from "../models/payment/payment_v3";
import { PaymentEventV4 } from "../models/payment/payment_v4";

/**
 * convert V2 to V3
 * @param {ExpenseEventV3 | PaymentEvent | null} event expense
 * @return {Event | null } expense
 */
export function convertEventV3ToV4(event: EventV3 | null):
    EventV4 | null {
    if (event === undefined) return null;
    if (event === null) return null;
    if (event.type === "payment") return convertPayment(event)
    return convertExpense(event)
}

/**
 * Convert Event
 * @param {PaymentEventV3} event event to convert
 * @return {PaymentEvent}
 */
function convertPayment(event: PaymentEventV3): PaymentEventV4 {
    return {
        createdBy: event.createdBy,
        currency: event.currency,
        amount: event.amount,
        id: event.id,
        paidBy: event.createdBy,
        paidTo: event.paidTo,
        timestamp: event.timestamp,
        type: event.type,
    }
}

/**
 * Convert event
 * @param {ExpenseEventV3} event expense event
 * @return {ExpenseEventV4}
 */
function convertExpense(event: ExpenseEventV3): ExpenseEventV4 {
    return {
        createdBy: event.createdBy,
        currency: event.currency,
        description: event.description,
        id: event.id,
        payee: event.payee,
        sharedExpenses: event.sharedExpenses,
        timestamp: event.timestamp,
        type: event.type,
        tempParticipants: [],
    }
}