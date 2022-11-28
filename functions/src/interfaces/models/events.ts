import { EventDTO } from "../dto/event-dto";
import { getListOfIndividualExpenses } from "../dto/individual-expense-dto";
import { IndividualExpense } from "./individual-expense";

export type Event = ExpenseChangeEvent | PaymentEvent | ExpenseEvent

export interface ExpenseEvent {
    eventType: "expense";
    id: string;
    createdBy: string;
    description: string;
    payee: string;
    sharedExpense: number;
    individualExpenses: IndividualExpense[];
    timeStamp: number;
}

export interface PaymentEvent {
    eventType: "payment";
    createdBy: string;
    paidTo: string;
    amount: number;
    timeStamp: number;
}

export interface ExpenseChangeEvent {
    eventType: "change";
    createdBy: string;
    groupExpenseOriginal: ExpenseEvent;
    groupExpenseEdited: ExpenseEvent;
    timeStamp: number;
}

/**
 * Convert eventDTO to event
 * @param {EventDTO} event event to be converted
 * @return {Event} event
 */
export function getEventFromDTO(event: EventDTO): Event {
    if (event.eventType === "expense") {
        return {
            eventType: event.eventType,
            id: event.id,
            createdBy: event.createdBy.id,
            description: event.description,
            payee: event.payee.id,
            timeStamp: event.timeStamp,
            sharedExpense: event.sharedExpense,
            individualExpenses:
                getListOfIndividualExpenses(event.individualExpenses),
        } as ExpenseEvent
    }
    if (event.eventType === "payment") {
        return {
            eventType: event.eventType,
            paidTo: event.paidTo.id,
            timeStamp: event.timeStamp,
            createdBy: event.createdBy.id,
            amount: event.amount,
        } as PaymentEvent
    }
    if (event.eventType === "change") {
        return {
            eventType: event.eventType,
            createdBy: event.createdBy.id,
            timeStamp: event.timeStamp,
            groupExpenseOriginal: {
                eventType: event.groupExpenseOriginal.eventType,
                id: event.groupExpenseOriginal.id,
                createdBy: event.groupExpenseOriginal.createdBy.id,
                description: event.groupExpenseOriginal.description,
                payee: event.groupExpenseOriginal.payee.id,
                timeStamp: event.groupExpenseOriginal.timeStamp,
                sharedExpense: event.groupExpenseOriginal.sharedExpense,
                individualExpenses: getListOfIndividualExpenses(
                    event.groupExpenseOriginal.individualExpenses),
            } as ExpenseEvent,
            groupExpenseEdited: {
                eventType: event.groupExpenseEdited.eventType,
                id: event.groupExpenseEdited.id,
                createdBy: event.groupExpenseEdited.createdBy.id,
                description: event.groupExpenseEdited.description,
                payee: event.groupExpenseEdited.payee.id,
                timeStamp: event.groupExpenseEdited.timeStamp,
                sharedExpense: event.groupExpenseEdited.sharedExpense,
                individualExpenses: getListOfIndividualExpenses(
                    event.groupExpenseEdited.individualExpenses),
            } as ExpenseEvent,
        } as ExpenseChangeEvent
    }
    throw Error("Invalid type")
}