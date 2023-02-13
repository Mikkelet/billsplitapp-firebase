import { Response } from "firebase-functions";
import { Service } from "../../interfaces/models/service";
import { validateService } from "./base-validate-service";

/**
 * Validate a service object before adding
 * @param {Response} res response object
 * @param {string} uid id of user making request
 * @param {Service} service Service to be validated
 * @return {boolean} returns true if valid
 */
export function validateAddService(res: Response, uid: string, service: Service): boolean {
    if (service.id) {
        res.status(400).send("Service already has id")
        return false
    }
    return validateService(res, uid, service)
}