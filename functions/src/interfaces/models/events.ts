import IndividualExpense from "./individual-expense";

export interface Expense {
    eventType: "expense"
    id: string
    createdBy: string
    description: string
    payee: string
    sharedExpense: number
    individualExpenses: IndividualExpense[]
    timeStamp: number
}

export interface Payment {
    eventType: "payment"
    createdBy: string
    paidTo: string
    amount: number
    timeStamp: number
}

export interface ExpenseChange {
    eventType: "change"
    createdBy: string
    groupExpenseOriginal: Expense
    groupExpenseEdited: Expense
    timeStamp: number
}