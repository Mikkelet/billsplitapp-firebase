import Debt from "../../interfaces/models/debt";
import { ExpenseEventV2, PaymentV2 } from "./event_v2";

// V2
export interface GroupV2 {
    id: string;
    name: string;
    people: string[];
    pastMembers: string[],
    createdBy: string;
    timeStamp: string;
    debts: Debt[] | undefined;
    individualExpense: any[] | undefined,
    latestEvent: PaymentV2 | ExpenseEventV2 | null;
}