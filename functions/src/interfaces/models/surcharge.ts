export interface Surcharge {
    name: string;
    type: "percentage" | "fixed";
    value: number;
}