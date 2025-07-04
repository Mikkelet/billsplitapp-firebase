import { ExpenseEvent, PaymentEvent, Event } from "../../interfaces/models/events";
import { PaymentEventV4 } from "../models/payment/payment_v4";
import { ExpenseEventV6 } from "../models/expense/expense_v6";
import { EventV6 } from "../models/event/event_v6";

/**
 * convert V2 to V3
 * @param {ExpenseEventV4 | PaymentEvent | null} event expense
 * @return {Event | null } expense
 */
export function convertEventV6ToV7(event: EventV6): Event {
    if (event.type === "payment") return convertPayment(event);
    return convertExpense(event);
}

/**
 * Convert event
 * @param {ExpenseEventV3} event expense event
 * @return {ExpenseEventV4}
 */
function convertExpense(event: ExpenseEventV6): ExpenseEvent {
    return {
        createdBy: event.createdBy,
        currency: event.currency,
        description: event.description,
        id: event.id,
        date: event.date,
        payee: event.payee,
        receiptImageUrl: event.receiptImageUrl,
        sharedExpenses: event.sharedExpenses,
        timestamp: event.timestamp,
        type: event.type,
        tempParticipants: event.tempParticipants,
        surcharges: [],
    }
}

/**
 * Convert event
 * @param {ExpenseEventV3} event expense event
 * @return {ExpenseEventV4}
 */
function convertPayment(event: PaymentEventV4): PaymentEvent {
    return {
        createdBy: event.createdBy,
        currency: event.currency,
        id: event.id,
        amount: event.amount,
        paidBy: event.paidBy,
        paidTo: event.paidTo,
        timestamp: event.timestamp,
        type: event.type,
    }
}