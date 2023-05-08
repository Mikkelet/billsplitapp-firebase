import { DebtDTO } from "./dto/debt-dto";

export interface DeleteEventRequest {
    debts: DebtDTO[];
}