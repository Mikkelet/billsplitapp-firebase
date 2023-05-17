import { Request, Response } from "firebase-functions";
import logRequest from "../utils/log-utils";
import { getCurrencies } from "../collections/currenciesCollecttion";
import { handleError } from "../utils/error-utils";

const getExchangeRatesImpl = async (req: Request, res: Response, _: string) => {
    logRequest(req)

    try {
        const response = await getCurrencies()
        res.status(200).send({
            rates: response,
        })
    } catch (e) {
        handleError(e, res)
    }

}

export default getExchangeRatesImpl
