import { findPerson } from "../../collections/user-collection";
import {
    Event,
    ExpenseChangeEvent,
    ExpenseEvent,
    PaymentEvent,
} from "../models/events";
import { FriendStatus } from "../models/friend";
import { PersonWithId } from "../models/person";
import Currency from "../models/currency";
import { PersonDTO } from "./person-dto";
import { SharedExpenseDTO, convertSharedExpensesToDTO } from "./shared-expense-dto";
import TempParticipant from "../models/temp-participant";

export interface FriendStatusDTO {
    type: FriendStatus
}

export type EventDTO =
    ExpenseChangeEventDTO
    | PaymentEventDTO
    | ExpenseEventDTO;

export interface ExpenseEventDTO {
    type: "expense";
    id: string;
    createdBy: PersonDTO;
    description: string;
    payee: PersonDTO;
    tempParticipants: TempParticipant[];
    sharedExpenses: SharedExpenseDTO[];
    timestamp: number;
    currency: Currency;
}

export interface PaymentEventDTO {
    type: "payment";
    id: string,
    createdBy: PersonDTO;
    paidBy: PersonDTO;
    paidTo: PersonDTO;
    amount: number;
    timestamp: number;
    currency: Currency;
}

export interface ExpenseChangeEventDTO {
    type: "change";
    id: string
    createdBy: PersonDTO;
    groupExpenseOriginal: ExpenseEventDTO;
    groupExpenseEdited: ExpenseEventDTO;
    timestamp: number;
}

/**
 * Convert Event to EventDTO
 * @param {Event} event event to convert
 * @param {Person[]} people people in group
 * @return {EventDTO} EventDTO
 */
export function convertEventToDTO(event: Event, people: PersonWithId[]): EventDTO {
    console.log("converting event", event.id);

    if (event.type === "expense") {
        const expense = event as ExpenseEvent
        return {
            type: expense.type,
            id: expense.id,
            createdBy: findPerson(people, expense.createdBy),
            description: expense.description,
            payee: findPerson(people, expense.payee),
            sharedExpenses: convertSharedExpensesToDTO(expense.sharedExpenses, people),
            timestamp: expense.timestamp,
            tempParticipants: expense.tempParticipants,
            currency: expense.currency,
        } as ExpenseEventDTO
    }
    if (event.type === "change") {
        const change = event as ExpenseChangeEvent
        return {
            id: change.id,
            type: change.type,
            createdBy: findPerson(people, event.createdBy),
            timestamp: change.timestamp,
            groupExpenseEdited: {
                type: change.groupExpenseEdited.type,
                id: change.groupExpenseEdited.id,
                createdBy:
                    findPerson(people, change.groupExpenseEdited.createdBy),
                description: change.groupExpenseEdited.description,
                sharedExpenses:
                    convertSharedExpensesToDTO(change.groupExpenseEdited.sharedExpenses, people),
                payee: findPerson(people, change.groupExpenseEdited.payee),
                timestamp: change.groupExpenseEdited.timestamp,
                currency: change.groupExpenseEdited.currency,
            } as ExpenseEventDTO,
            groupExpenseOriginal: {
                type: change.groupExpenseOriginal.type,
                id: change.groupExpenseOriginal.id,
                createdBy:
                    findPerson(people, change.groupExpenseOriginal.createdBy),
                description: change.groupExpenseOriginal.description,
                sharedExpenses:
                    convertSharedExpensesToDTO(change.groupExpenseOriginal.sharedExpenses, people),
                payee: findPerson(people, change.groupExpenseOriginal.payee),
                timestamp: change.groupExpenseOriginal.timestamp,
                currency: change.groupExpenseOriginal.currency,
            } as ExpenseEventDTO,
        } as ExpenseChangeEventDTO
    }
    if (event.type === "payment") {
        const payment = event as PaymentEvent
        return {
            id: payment.id,
            type: payment.type,
            createdBy: findPerson(people, payment.createdBy),
            amount: payment.amount,
            paidTo: findPerson(people, payment.paidTo),
            timestamp: payment.timestamp,
            paidBy: findPerson(people, payment.paidBy),
            currency: payment.currency,
        } as PaymentEventDTO
    }
    throw Error("Invalid event type")
}