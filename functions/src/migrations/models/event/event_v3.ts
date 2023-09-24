import { ExpenseEventV3 } from "../expense/expense_v3";
import { PaymentEventV3 } from "../payment/payment_v3";

export type EventV3 = PaymentEventV3 | ExpenseEventV3
