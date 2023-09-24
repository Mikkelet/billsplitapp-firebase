// V2
export interface ServiceV1 {
    id: string,
    name: string,
    createdBy: string,
    imageUrl: string,
    monthlyExpense: number,
    payer: string,
    participants: string[],
}