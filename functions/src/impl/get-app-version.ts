import { Request, Response } from "firebase-functions";
import logRequest from "../utils/log-utils"
import { appVersionDoc } from "../collections/app-data-collection";
import { AppVersion } from "../interfaces/models/app-version";
import { handleError } from "../utils/error-utils";

const getAppVersionImpl = async (req: Request, res: Response) => {
    logRequest(req)
    try {
        const appVersionRequest = await appVersionDoc.get()
        const appVersionData = appVersionRequest.data() as AppVersion
        res.send(appVersionData)
    } catch (e) {
        handleError(e, res)
    }
}

export default getAppVersionImpl