import * as functions from "firebase-functions";
import ExchangeRates from "../interfaces/models/exchange-rate";
import { updateCurrencies } from "../collections/currenciesCollecttion";

const syncExchangeRatesImpl = async (_: functions.EventContext) => {
    console.log("Starting sync exchange rates cron");
    try {
        const url = "https://api.apilayer.com/exchangerates_data/latest?base=USD"
        const response = await fetch(url, {
            headers: {
                apikey: "kvVjafk8P3ucfgtLdACLVb5VAEWdHvSg",
            },
        })
        const body = await response.json() as ExchangeRates
        await updateCurrencies(body)
    } catch (e) {
        console.error("Failed to run cron job", e)
    }
}

export default syncExchangeRatesImpl