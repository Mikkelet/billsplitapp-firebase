import { Expense, ExpenseChange, Payment } from "./models/events";

export default interface GetEventsResponse {
    events: Array<Expense | Payment | ExpenseChange>
}