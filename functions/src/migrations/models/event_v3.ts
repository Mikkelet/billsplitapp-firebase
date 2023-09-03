import Currency from "../../interfaces/models/currency";
import { SharedExpense } from "../../interfaces/models/shared-expenses";

export interface ExpenseEventV3 {
    id: string;
    type: "expense";
    createdBy: string;
    description: string;
    payee: string;
    sharedExpenses: SharedExpense[];
    timestamp: number;
    currency: Currency;
}