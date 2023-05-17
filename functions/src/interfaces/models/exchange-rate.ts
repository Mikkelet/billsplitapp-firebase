export default interface ExchangeRates {
    base: string;
    date: string;
    timestamp: number;
    rates: Map<string, number>
}