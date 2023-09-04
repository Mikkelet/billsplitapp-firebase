import { PaymentEvent } from "../../interfaces/models/events";
import { ExpenseEventV2, PaymentV2 } from "../models/event_v2";
import { EventV3 } from "../v3_v5/convert_events_v4_v5";

/**
 * Convert v2 to v3
 * @param {PaymentV2} payment payment
 * @return {PaymentEvent} event
 */
export function convertPaymentV2toV3(payment: PaymentV2): PaymentEvent {
    return {
        ...payment,
        timestamp: payment.timeStamp,
        currency: {
            symbol: "usd",
            rateSnapshot: 1,
        },
    }
}

/**
 * convert V2 to V3
 * @param {ExpenseEventV2 | PaymentV2 | null} expense expense
 * @return {ExpenseEvent | PaymentEvent | null } expense
 */
export function convertExpenseV2ToV3(expense: ExpenseEventV2 | PaymentV2 | null):
    EventV3 {
    if (expense === undefined) return null;
    if (expense === null) return null;
    if (expense.type === "payment") return convertPaymentV2toV3(expense as PaymentV2);
    return {
        id: expense.id,
        createdBy: expense.createdBy,
        description: expense.description,
        payee: expense.payee,
        sharedExpenses: expense.sharedExpenses,
        timeStamp: expense.timeStamp,
        type: expense.type,
        currency: {
            symbol: "usd",
            rateSnapshot: 1,
        },
    }
}