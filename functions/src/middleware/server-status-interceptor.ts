import { Request, Response } from "firebase-functions";
import { getAppVersion } from "../collections/app-data-collection";

/**
 * Interceptor that checks server status before continuing. If server is down for maintanence, throw error to front end.
 * @param {Request} req 
 * @param {Response} res 
 * @param {Callback} callback 
 */
export async function checkServerStatus(req: Request, res: Response, callback: (req: Request, res: Response) => void) {
    const appVersion = await getAppVersion()
    if (appVersion.serverMaintenance === true) {
        res.status(503).send("Server down for maintanence")
        return
    }
    callback(req, res)
}