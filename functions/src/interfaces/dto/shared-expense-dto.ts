import { findPerson } from "../../collections/user-collection";
import { PersonWithId } from "../models/person";
import { SharedExpense } from "../models/shared-expenses";
import { PersonDTO } from "./person-dto";

export interface SharedExpenseDTO {
    description: string,
    participants: PersonDTO[],
    expense: number,
}

/**
 * Convert data from database to data readable by frontend
 * @param {SharedExpense} sharedExpense shared expense to convert
 * @return {SharedExpenseDTO} return converted shared expense
 */
export function convertSharedExpenseToDTO(
    sharedExpense: SharedExpense, people: PersonWithId[]
): SharedExpenseDTO {
    return {
        description: sharedExpense.description,
        expense: sharedExpense.expense,
        participants: sharedExpense.participants.map((p) => findPerson(people, p))
    } as SharedExpenseDTO;
}

/**
 * convert list of shared expenses to DTOs
 * @param {SharedExpense[]} sharedExpenses 
 * @returns {SharedExpenseDTO[]}
 */
export function convertSharedExpensesToDTO(
    sharedExpenses: SharedExpense[], people: PersonWithId[]
): SharedExpenseDTO[] {
    return sharedExpenses.map((se) => convertSharedExpenseToDTO(se, people));
}