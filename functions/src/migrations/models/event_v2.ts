import { SharedExpense } from "../../interfaces/models/shared-expenses";

// V2
export type EventV2 = PaymentV2 | ExpenseEventV2

export interface PaymentV2 {
    id: string,
    type: "payment";
    createdBy: string;
    paidTo: string;
    amount: number;
    timeStamp: number;
}

export interface ExpenseEventV2 {
    id: string;
    type: "expense";
    createdBy: string;
    description: string;
    payee: string;
    sharedExpenses: SharedExpense[],
    timeStamp: number;
}