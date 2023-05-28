import { Service } from "../../interfaces/models/service";
import { billSplitError } from "../../utils/error-utils";

/**
 * Validate a service object before responding
 * @param {string} uid id of user making request
 * @param {Service} service Service to be validated
 */
export function validateService(uid: string, service: Service) {

    if (!service.name) {
        throw billSplitError(400, "Missing name");
    }
    if (!service.participants || service.participants.length === 0) {
        throw billSplitError(400, "Missing participants");
    }
    if (service.monthlyExpense <= 0) {
        throw billSplitError(400, "Monthly expense must be positive number");
    }
    if (service.id === "" && uid !== service.createdBy) {
        console.error(
            "User trying to create an event on behalf of another user",
            { uid: uid, createdBy: service.createdBy },
        )
        throw billSplitError(400, "Service was not created")
    }
}