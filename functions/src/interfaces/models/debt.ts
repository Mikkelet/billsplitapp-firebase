import { DebtDTO } from "../dto/debt-dto";

export interface Debt {
    userId: string;
    owes: number;
}

/**
 * Convert DTO to Debt
 * @param {DebtDTO} debtDTO dto to be converted
 * @return {Debt} converted Debt
 */
export function convertDTOtoDebt(debtDTO: DebtDTO): Debt {
    return {
        userId: debtDTO.userId,
        owes: debtDTO.owes,
    }
}