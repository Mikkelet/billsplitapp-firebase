import { PaymentEvent } from "../../../interfaces/models/events";
import { ExpenseEventV4 } from "../expense/expense_v4";

export type EventV4 = PaymentEvent | ExpenseEventV4
