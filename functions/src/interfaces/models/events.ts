import { EventDTO } from "../dto/event-dto";
import { SharedExpense, convertDTOtoSharedExpenses } from "./shared-expenses";
import Currency from "./currency";

export type Event = ExpenseChangeEvent | PaymentEvent | ExpenseEvent

export interface ExpenseEvent {
    id: string;
    type: "expense";
    createdBy: string;
    description: string;
    payee: string;
    sharedExpenses: SharedExpense[],
    timestamp: number;
    currency: Currency;
}

export interface PaymentEvent {
    id: string,
    type: "payment";
    createdBy: string;
    paidTo: string;
    amount: number;
    timestamp: number;
    currency: Currency;
}

export interface ExpenseChangeEvent {
    id: string,
    type: "change";
    createdBy: string;
    groupExpenseOriginal: ExpenseEvent;
    groupExpenseEdited: ExpenseEvent;
    timestamp: number;
}

/**
 * Convert eventDTO to event
 * @param {string} createdByUid userId for createdBy
 * @param {EventDTO} event event to be converted
 * @return {Event} event
 */
export function convertDTOtoEvent(createdByUid: string, event: EventDTO): Event {

    if (event.type === "expense") {
        return {
            type: event.type,
            id: event.id,
            createdBy: event.createdBy.id,
            description: event.description,
            payee: event.payee.id,
            timestamp: event.timestamp,
            currency: event.currency,
            sharedExpenses: convertDTOtoSharedExpenses(event.sharedExpenses),
        } as ExpenseEvent
    }
    if (event.type === "payment") {
        return {
            type: event.type,
            paidTo: event.paidTo.id,
            timestamp: event.timestamp,
            createdBy: event.createdBy.id,
            amount: event.amount,
            currency: event.currency,
            id: event.id,
        } as PaymentEvent
    }
    if (event.type === "change") {
        return {
            type: event.type,
            createdBy: createdByUid,
            timestamp: event.timestamp,
            groupExpenseOriginal: {
                type: event.groupExpenseOriginal.type,
                id: event.groupExpenseOriginal.id,
                createdBy: event.groupExpenseOriginal.createdBy.id,
                description: event.groupExpenseOriginal.description,
                payee: event.groupExpenseOriginal.payee.id,
                timestamp: event.groupExpenseOriginal.timestamp,
                currency: event.groupExpenseOriginal.currency,
                sharedExpenses:
                    convertDTOtoSharedExpenses(event.groupExpenseOriginal.sharedExpenses),
            } as ExpenseEvent,
            groupExpenseEdited: {
                type: event.groupExpenseEdited.type,
                id: event.groupExpenseEdited.id,
                createdBy: event.groupExpenseEdited.createdBy.id,
                description: event.groupExpenseEdited.description,
                payee: event.groupExpenseEdited.payee.id,
                timestamp: event.groupExpenseEdited.timestamp,
                currency: event.groupExpenseEdited.currency,
                sharedExpenses:
                    convertDTOtoSharedExpenses(event.groupExpenseEdited.sharedExpenses),
            } as ExpenseEvent,
        } as ExpenseChangeEvent
    }
    throw Error("Invalid type")
}

// V2
export type EventV2 = PaymentV2 | ExpenseEventV2


export interface PaymentV2 {
    id: string,
    type: "payment";
    createdBy: string;
    paidTo: string;
    amount: number;
    timeStamp: number;
}

export interface ExpenseEventV2 {
    id: string;
    type: "expense";
    createdBy: string;
    description: string;
    payee: string;
    sharedExpenses: SharedExpense[],
    timeStamp: number;
}
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
    ExpenseEvent | PaymentEvent | null {
    if (expense === undefined) return null;
    if (expense === null) return null;
    if (expense.type === "payment") return convertPaymentV2toV3(expense as PaymentV2);
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
