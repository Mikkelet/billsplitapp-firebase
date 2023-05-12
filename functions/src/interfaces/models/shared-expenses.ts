import { SharedExpenseDTO } from "../dto/shared-expense-dto";
import SymbolizedExpense from "./symbolized-expense";

export interface SharedExpense {
    participants: string[];
    expense: SymbolizedExpense;
    description: string;
}

/**
 * Convert data from database to data readable by frontend
 * @param {SharedExpenseDTO} sharedExpense shared expense to convert
 * @return {SharedExpense} return converted shared expense
 */
export function convertDtoToSharedExpense(sharedExpense: SharedExpenseDTO): SharedExpense {
    return {
        description: sharedExpense.description,
        expense: sharedExpense.expense,
        participants: sharedExpense.participants.map((p) => p.id),
    } as SharedExpense;
}

/**
 * convert list of shared expenses to DTOs
 * @param {SharedExpense[]} sharedExpenses
 * @return {SharedExpenseDTO[]}
 */
export function convertDTOtoSharedExpenses(sharedExpenses: SharedExpenseDTO[]): SharedExpense[] {
    return sharedExpenses.map((se) => convertDtoToSharedExpense(se));
}