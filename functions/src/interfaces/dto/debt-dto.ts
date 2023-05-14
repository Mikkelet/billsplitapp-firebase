import Debt from "../models/debt";

export interface DebtDTO {
    userId: string;
    owes: number;
}

/**
 * Convert Debt to DebtDTO
 * @param {Debt} debt debt object to convert
 * @return {DebtDTO} converted DTO
 */
export function convertDebtToDTO(debt: Debt): DebtDTO {
    return {
        userId: debt.userId,
        owes: debt.owes,
    }
}