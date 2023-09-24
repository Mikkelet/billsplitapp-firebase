import { ExpenseEventV2 } from "../expense/expense_v2";
import { PaymentEventV2 } from "../payment/payment_v2";

export type EventV2 = PaymentEventV2 | ExpenseEventV2
