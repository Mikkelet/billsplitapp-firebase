import { findPerson } from "../../collections/user-collection";
import { IndividualExpenseDTO } from "../dto/individual-expense-dto";
import { PersonWithId } from "./person";

export interface IndividualExpense {
    person: string;
    expense: number;
}

/**
 * Convert data structure from database to front end data structure
 * @param {IndividualExpense} individualExpense database json to convert
 * @param {Person[]} people people that's part of the group
 * @return {IndividualExpenseDTO} individual expense dto
 */
export function convertIndividualExpenseToDTO(
    individualExpense: IndividualExpense,
    people: PersonWithId[]
): IndividualExpenseDTO {
    return {
        expense: individualExpense.expense,
        person: findPerson(people, individualExpense.person),
    }
}

/**
 * Convert a list of individual expenses
 * @param {IndividualExpense[]} individualExpenses list to convert
 * @param {Person[]} people people in group
 * @return {IndividualExpenseDTO[]} list of converted expenses
 */
export function convertIndividualExpensesToDTOs(
    individualExpenses: IndividualExpense[],
    people: PersonWithId[]
): IndividualExpenseDTO[] {
    return individualExpenses.map((ie) => convertIndividualExpenseToDTO(ie, people))
}