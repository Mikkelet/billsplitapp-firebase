import { ScheduledEvent } from "firebase-functions/v2/scheduler";
import ExchangeRates from "../interfaces/models/exchange-rate";
import { updateCurrencies } from "../collections/currencies-collection";
import axios from "axios"

const syncExchangeRatesImpl = async (_event: ScheduledEvent) => {
    console.log("Starting sync exchange rates cron");
    try {
        const url = "https://api.apilayer.com/exchangerates_data/latest?base=USD"
        const response = await axios.get(url, {
            headers: {
                apikey: "kvVjafk8P3ucfgtLdACLVb5VAEWdHvSg",
            },
        })
        const body = await response.data as ExchangeRates
        await updateCurrencies(body)
    } catch (e) {
        console.error("Failed to run cron job", e)
    }
}

export default syncExchangeRatesImpl