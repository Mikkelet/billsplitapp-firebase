import { Response } from "firebase-functions";
import { Service } from "../../interfaces/models/service";

/**
 * Validate a service object before responding
 * @param {Response} res response object
 * @param {string} uid id of user making request
 * @param {Service} service Service to be validated
 * @return {boolean} returns true if valid
 */
export function validateService(res: Response, uid: string, service: Service): boolean {

    if (!service.name) {
        res.status(400).send("Missing name");
        return false
    } else if (!service.participants || service.participants.length === 0) {
        res.status(400).send("Missing participants");
        return false
    } else if (service.monthlyExpense <= 0) {
        res.status(400).send("Monthly expense must be positive number");
        return false
    } else if (uid !== service.createdBy) {
        console.error(
            "User trying to create an event on behalf of another user",
            { uid: uid, createdBy: service.createdBy },
        )
        res.status(400).send("Service was not created")
        return false
    }
    return true
}