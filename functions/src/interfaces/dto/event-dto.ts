import { findPerson } from "../../utils";
import {
    Event,
    ExpenseChangeEvent,
    ExpenseEvent,
    PaymentEvent,
} from "../models/events";
import {
    getIndividualExpenseDTO,
    getListOfIndividualExpenseDTO,
} from "../models/individual-expense";
import Person from "../models/person";
import { IndividualExpenseDTO } from "./individual-expense-dto";

export type EventDTO =
    ExpenseChangeEventDTO
    | PaymentEventDTO
    | ExpenseEventDTO;

export interface ExpenseEventDTO {
    type: "expense";
    id: string;
    createdBy: Person;
    description: string;
    payee: Person;
    sharedExpense: number;
    individualExpenses: IndividualExpenseDTO[];
    timeStamp: number;
}

export interface PaymentEventDTO {
    id: string,
    type: "payment";
    createdBy: Person;
    paidTo: Person;
    amount: number;
    timeStamp: number;
}

export interface ExpenseChangeEventDTO {
    id: string
    type: "change";
    createdBy: Person;
    groupExpenseOriginal: ExpenseEventDTO;
    groupExpenseEdited: ExpenseEventDTO;
    timeStamp: number;
}

/**
 * Convert Event to EventDTO
 * @param {Event} event event to convert
 * @param {Person[]} people people in group
 * @return {EventDTO} EventDTO
 */
export function convertEventToDTO(event: Event, people: Person[]): EventDTO {
    if (event.type === "expense") {
        const expense = event as ExpenseEvent
        return {
            type: expense.type,
            id: expense.id,
            createdBy: findPerson(people, expense.createdBy),
            description: expense.description,
            payee: findPerson(people, expense.payee),
            individualExpenses: expense.individualExpenses
                .map((ie) => getIndividualExpenseDTO(ie, people)),
            sharedExpense: expense.sharedExpense,
            timeStamp: expense.timeStamp,
        } as ExpenseEventDTO
    }
    if (event.type === "change") {
        const change = event as ExpenseChangeEvent
        return {
            type: change.type,
            createdBy: findPerson(people, event.createdBy),
            timeStamp: change.timeStamp,
            groupExpenseEdited: {
                type: change.groupExpenseEdited.type,
                id: change.groupExpenseEdited.id,
                createdBy:
                    findPerson(people, change.groupExpenseEdited.createdBy),
                description: change.groupExpenseEdited.description,
                individualExpenses: getListOfIndividualExpenseDTO(
                    change.groupExpenseEdited.individualExpenses, people),
                payee: findPerson(people, change.groupExpenseEdited.payee),
                sharedExpense: change.groupExpenseEdited.sharedExpense,
                timeStamp: change.groupExpenseEdited.timeStamp,
            } as ExpenseEventDTO,
            groupExpenseOriginal: {
                type: change.groupExpenseOriginal.type,
                id: change.groupExpenseOriginal.id,
                createdBy:
                    findPerson(people, change.groupExpenseOriginal.createdBy),
                description: change.groupExpenseOriginal.description,
                individualExpenses: getListOfIndividualExpenseDTO(
                    change.groupExpenseOriginal.individualExpenses, people),
                payee: findPerson(people, change.groupExpenseOriginal.payee),
                sharedExpense: change.groupExpenseOriginal.sharedExpense,
                timeStamp: change.groupExpenseOriginal.timeStamp,
            } as ExpenseEventDTO,
        } as ExpenseChangeEventDTO
    }
    if (event.type === "payment") {
        const payment = event as PaymentEvent
        return {
            type: payment.type,
            createdBy: findPerson(people, payment.createdBy),
            amount: payment.amount,
            paidTo: findPerson(people, payment.paidTo),
            timeStamp: payment.timeStamp,
        } as PaymentEventDTO
    }
    throw Error("Invalid event type")
}