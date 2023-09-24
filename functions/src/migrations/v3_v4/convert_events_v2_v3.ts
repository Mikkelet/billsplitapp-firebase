import { EventV2 } from "../models/event/event_v2";
import { EventV3 } from "../models/event/event_v3";
import { PaymentEventV2 } from "../models/payment/payment_v2";
import { PaymentEventV3 } from "../models/payment/payment_v3";

/**
 * Convert v2 to v3
 * @param {PaymentV2} payment payment
 * @return {PaymentEventV4} event
 */
export function convertPaymentV2toV3(payment: PaymentEventV2): PaymentEventV3 {
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
 * @return {ExpenseEventV3 | PaymentEventV3 | null } expense
 */
export function convertExpenseV2ToV3(expense: EventV2 | null): EventV3 | null {
    if (expense === undefined) return null;
    if (expense === null) return null;
    if (expense.type === "payment") return convertPaymentV2toV3(expense as PaymentEventV2);
    return {
        id: expense.id,
        createdBy: expense.createdBy,
        description: expense.description,
        payee: expense.payee,
        sharedExpenses: expense.sharedExpenses,
        timestamp: expense.timeStamp,
        type: expense.type,
        currency: {
            symbol: "usd",
            rateSnapshot: 1,
        },
    }
}