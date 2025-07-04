import { SharedExpense } from "../../../interfaces/models/shared-expenses";
import TempParticipant from "../../../interfaces/models/temp-participant";
import Currency from "../../../interfaces/models/currency";

export interface ExpenseEventV6 {
    id: string;
    type: "expense";
    createdBy: string;
    description: string;
    payee: string;
    sharedExpenses: SharedExpense[],
    tempParticipants: TempParticipant[],
    timestamp: number;
    receiptImageUrl: string,
    currency: Currency;
    date: string;
}