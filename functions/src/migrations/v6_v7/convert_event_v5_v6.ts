import { Event, ExpenseEvent, PaymentEvent } from "../../interfaces/models/events";
import { EventV5 } from "../models/event/event_v5";
import { ExpenseEventV5 } from "../models/expense/expense_v5";
import { PaymentEventV4 } from "../models/payment/payment_v4";

/**
 * convert V2 to V3
 * @param {ExpenseEventV4 | PaymentEvent | null} event expense
 * @return {Event | null } expense
 */
export function convertEventV5ToV6(event: EventV5):
    Event {
    if (event.type === "payment") return convertPayment(event);
    return convertExpense(event);
}

/**
 * Convert event
 * @param {ExpenseEventV3} event expense event
 * @return {ExpenseEventV4}
 */
function convertExpense(event: ExpenseEventV5): ExpenseEvent {
    const date = new Date(0);
    date.setUTCMilliseconds(event.timestamp)
    const iso8601date = date.toISOString()
    return {
        createdBy: event.createdBy,
        currency: event.currency,
        description: event.description,
        id: event.id,
        date: iso8601date,
        payee: event.payee,
        receiptImageUrl: event.receiptImageUrl,
        sharedExpenses: event.sharedExpenses,
        timestamp: event.timestamp,
        type: event.type,
        tempParticipants: event.tempParticipants,
    }
}

/**
 * Convert event
 * @param {ExpenseEventV3} event expense event
 * @return {ExpenseEventV4}
 */
function convertPayment(event: PaymentEventV4): PaymentEvent {
    const date = new Date(0);
    date.setUTCMilliseconds(event.timestamp)
    const iso8601date = date.toISOString()
    return {
        createdBy: event.createdBy,
        currency: event.currency,
        id: event.id,
        date: iso8601date,
        amount: event.amount,
        paidBy: event.paidBy,
        paidTo: event.paidTo,
        timestamp: event.timestamp,
        type: event.type,
    }
}