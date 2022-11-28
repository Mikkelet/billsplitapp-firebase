import IndividualExpense from "./individual-expense";

export type Event = ExpenseChangeEvent | PaymentEvent | ExpenseEvent

export interface ExpenseEvent {
    eventType: "expense";
    id: string;
    createdBy: string;
    description: string;
    payee: string;
    sharedExpense: number;
    individualExpenses: IndividualExpense[];
    timeStamp: number;
}

export interface PaymentEvent {
    eventType: "payment";
    createdBy: string;
    paidTo: string;
    amount: number;
    timeStamp: number;
}

export interface ExpenseChangeEvent {
    eventType: "change";
    createdBy: string;
    groupExpenseOriginal: ExpenseEvent;
    groupExpenseEdited: ExpenseEvent;
    timeStamp: number;
}
