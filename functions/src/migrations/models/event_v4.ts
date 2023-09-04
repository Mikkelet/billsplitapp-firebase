import Currency from "../../interfaces/models/currency";
import { SharedExpense } from "../../interfaces/models/shared-expenses";
import { PaymentV3 } from "./event_v3";

export type EventV4 = PaymentV3 | ExpenseEventV4

export interface ExpenseEventV4 {
    id: string;
    type: "expense";
    createdBy: string;
    description: string;
    payee: string;
    sharedExpenses: SharedExpense[];
    timestamp: number;
    currency: Currency;
}
