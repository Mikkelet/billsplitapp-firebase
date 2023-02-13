import { Response } from "firebase-functions";
import { Service } from "../../interfaces/models/service";
import { validateService } from "./base-validate-service";

/**
 * Validate a service object before updating
 * @param {Response} res response object
 * @param {string} uid id of user making request
 * @param {Service} service Service to be validated
 * @return {boolean} returns true if valid
 */
export function validateUpdateService(res: Response, uid: string, service: Service): boolean {

    if (!service.id) {
        res.status(400).send("Missing ID")
        return false
    }
    return validateService(res, uid, service)
}