import { findPerson } from "../../utils";
import { IndividualExpenseDTO } from "../dto/individual-expense-dto";
import Person from "./person";

export interface IndividualExpense {
    person: string;
    expense: number;
    isParticipant: boolean;
}

/**
 * Convert data structure from database to front end data structure
 * @param {IndividualExpense} individualExpense database json to convert
 * @param {Person[]} people people that's part of the group
 * @return {IndividualExpenseDTO} individual expense dto
 */
export function getIndividualExpenseDTO(
    individualExpense: IndividualExpense,
    people: Person[]
): IndividualExpenseDTO {
    return {
        expense: individualExpense.expense,
        isParticipant: individualExpense.isParticipant,
        person: findPerson(people, individualExpense.person),
    }
}

/**
 * Convert a list of individual expenses
 * @param {IndividualExpense[]} individualExpenses list to convert
 * @param {Person[]} people people in group
 * @return {IndividualExpenseDTO[]} list of converted expenses
 */
export function getListOfIndividualExpenseDTO(
    individualExpenses: IndividualExpense[],
    people: Person[]
): IndividualExpenseDTO[] {
    return individualExpenses.map((ie) => getIndividualExpenseDTO(ie, people))
}