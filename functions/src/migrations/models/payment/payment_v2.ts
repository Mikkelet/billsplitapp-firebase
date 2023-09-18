export interface PaymentEventV2 {
    id: string,
    type: "payment";
    createdBy: string;
    paidTo: string;
    amount: number;
    timeStamp: number;
}