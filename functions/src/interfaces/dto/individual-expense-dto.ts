import { IndividualExpense } from "../models/individual-expense";
import { PersonDTO } from "./person-dto";

export interface IndividualExpenseDTO {
    person: PersonDTO;
    expense: number;
}

/**
 * Convert IndividualExpenseDTO to IndividualExpense
 * @param {IndividualExpenseDTO} IndividualExpenseDTO database json to convert
 * @return {IndividualExpense} individual expense dto
 */
export function convertDTOtoIndividualExpense(
    IndividualExpenseDTO: IndividualExpenseDTO
): IndividualExpense {
    return {
        expense: IndividualExpenseDTO.expense,
        person: IndividualExpenseDTO.person.id,
    }
}

/**
 * Convert a list of individual expenses
 * @param {IndividualExpenseDTO[]} individualExpenses list to convert
 * @return {IndividualExpense[]} converted list
 */
export function convertDTOsToIndividualExpenses(
    individualExpenses: IndividualExpenseDTO[]
): IndividualExpense[] {
    return individualExpenses.map((ie) => convertDTOtoIndividualExpense(ie))
}