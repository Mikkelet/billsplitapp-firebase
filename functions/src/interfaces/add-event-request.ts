import { Expense, ExpenseChange, Payment } from "./models/events";

export default interface AddEvent {
    groupId: string
    event: Expense | Payment | ExpenseChange
}