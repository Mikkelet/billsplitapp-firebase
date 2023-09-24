import { Person } from "../../../interfaces/models/person";
import { SharedExpense } from "../../../interfaces/models/shared-expenses";

interface IndividualExpense {
    expense: number;
    person: Person;
}

export interface ExpenseEventV2 {
    id: string;
    type: "expense";
    createdBy: string;
    description: string;
    payee: string;
    sharedExpenses: SharedExpense[],
    individualExpenses: IndividualExpense[]
    timeStamp: number;
}