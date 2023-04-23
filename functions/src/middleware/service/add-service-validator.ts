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
    if (service.monthlyExpense === 0) {
        res.status(400).send("Monthly expense cannot be 0")
        return false
    }
    if (service.participants.length === 0) {
        res.status(400).send("Service must include participants")
        return false
    }
    if (service.name === "") {
        res.status(400).send("Service must have a name")
        return false
    }
    if (service.createdBy !== uid) {
        console.log("Suspiscious add-service request", {
            service: service,
            requestUid: uid,
        });
        res.status(400).send("Unknown error occurred")
        return false
    }
    return validateService(res, uid, service)
}