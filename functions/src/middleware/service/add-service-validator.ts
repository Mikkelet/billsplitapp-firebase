import { Service } from "../../interfaces/models/service";
import { validateService } from "./base-validate-service";
import { billSplitError } from "../../utils/error-utils";

/**
 * Validate a service object before adding
 * @param {string} uid id of user making request
 * @param {Service} service Service to be validated
 */
export function validateAddService(uid: string, service: Service) {
    if (service.id) {
        throw billSplitError(400, "Service already has id")
    }
    if (service.monthlyExpense === 0) {
        throw billSplitError(400, "Monthly expense cannot be 0")
    }
    if (service.participants.length === 0) {
        throw billSplitError(400, "Service must include participants")
    }
    if (service.name === "") {
        throw billSplitError(400, "Service must have a name")
    }
    if (service.createdBy !== uid) {
        console.log("Suspiscious add-service request", {
            service: service,
            requestUid: uid,
        });
        throw billSplitError(400, "Unknown error occurred")
    }
    validateService(uid, service)
}