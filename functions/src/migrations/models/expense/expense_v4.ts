import Currency from "../../../interfaces/models/currency";
import { SharedExpense } from "../../../interfaces/models/shared-expenses";
import TempParticipant from "../../../interfaces/models/temp-participant";

export interface ExpenseEventV4 {
    id: string;
    type: "expense";
    createdBy: string;
    description: string;
    payee: string;
    sharedExpenses: SharedExpense[],
    tempParticipants: TempParticipant[],
    timestamp: number;
    currency: Currency;
}