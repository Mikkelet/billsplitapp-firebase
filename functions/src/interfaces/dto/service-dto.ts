import { PersonDTO } from "./person-dto";

export interface ServiceDTO {
    id: string,
    name: string,
    createdBy: PersonDTO,
    imageUrl: string,
    monthlyExpense: number,
    payer: PersonDTO,
    participants: PersonDTO[]
}