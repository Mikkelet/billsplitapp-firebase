import SymbolizedExpense from "../models/symbolized-expense";
import { PersonDTO } from "./person-dto";

export interface ServiceDTO {
    id: string,
    name: string,
    createdBy: PersonDTO,
    imageUrl: string,
    monthlyExpense: SymbolizedExpense,
    payer: PersonDTO,
    participants: PersonDTO[]
}