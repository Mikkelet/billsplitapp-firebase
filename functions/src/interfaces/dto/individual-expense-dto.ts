import { IndividualExpense } from "../models/individual-expense";
import Person from "../models/person";

export interface IndividualExpenseDTO {
    person: Person;
    expense: number;
    isParticipant: boolean;
}

/**
 * Convert IndividualExpenseDTO to IndividualExpense
 * @param {IndividualExpenseDTO} IndividualExpenseDTO database json to convert
 * @return {IndividualExpense} individual expense dto
 */
export function getIndExpenseFromIndExpenseDTO(
    IndividualExpenseDTO: IndividualExpenseDTO
): IndividualExpense {
    return {
        expense: IndividualExpenseDTO.expense,
        isParticipant: IndividualExpenseDTO.isParticipant,
        person: IndividualExpenseDTO.person.id,
    }
}

/**
 * Convert a list of individual expenses
 * @param {IndividualExpenseDTO[]} individualExpenses list to convert
 * @return {IndividualExpense[]} converted list
 */
export function getListOfIndividualExpenses(
    individualExpenses: IndividualExpenseDTO[]
): IndividualExpense[] {
    return individualExpenses.map((ie) => getIndExpenseFromIndExpenseDTO(ie))
}