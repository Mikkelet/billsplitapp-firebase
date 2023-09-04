import Currency from "../../interfaces/models/currency";
import { SharedExpense } from "../../interfaces/models/shared-expenses";

export interface ExpenseEventV3 {
    id: string;
    type: "expense";
    createdBy: string;
    description: string;
    payee: string;
    sharedExpenses: SharedExpense[];
    timeStamp: number;
    currency: Currency;
}

export interface PaymentV3 {
    id: string,
    type: "payment";
    createdBy: string;
    paidTo: string;
    amount: number;
    timestamp: number;
}