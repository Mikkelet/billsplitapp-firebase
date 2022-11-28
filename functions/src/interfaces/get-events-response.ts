import { ExpenseEvent, ExpenseChangeEvent, PaymentEvent } from "./models/events";

export default interface GetEventsResponse {
    events: Array<ExpenseEvent | PaymentEvent | ExpenseChangeEvent>;
}
