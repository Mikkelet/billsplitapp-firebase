import * as firebase from "firebase-admin";
import ExchangeRates from "../interfaces/models/exchange-rate";

const currenciesCollection =
    firebase.firestore().collection("currencies").doc("latest-rates");

/**
 * get the latest currencies and their exchange rates in USD
 * @return {Promise<Map<string, number>>} A map of Symbols (eg. EUR, USD) and their rates in USD
 */
export async function getCurrencies(): Promise<Map<string, number>> {
    const response = await currenciesCollection.get()
    const data = response.data() as ExchangeRates
    return data.rates
}

/**
 * Update the exchange rates
 * @param {ExchangeRates} exchangeRates data to update
 */
export async function updateCurrencies(exchangeRates: ExchangeRates) {
    await currenciesCollection.update(exchangeRates)
}