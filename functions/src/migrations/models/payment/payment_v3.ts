import Currency from "../../../interfaces/models/currency";

/**
 * Changes
 * renamed timeStamp -> timestamp
 * added currency
 */
export interface PaymentEventV3 {
    id: string,
    type: "payment";
    createdBy: string;
    paidTo: string;
    amount: number;
    timestamp: number;
    currency: Currency;
}