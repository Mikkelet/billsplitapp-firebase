import Currency from "../../../interfaces/models/currency";

export interface PaymentEventV4 {
    id: string,
    type: "payment";
    createdBy: string;
    paidTo: string;
    paidBy: string;
    amount: number;
    timestamp: number;
    currency: Currency;
}