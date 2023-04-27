import { Service } from "../../interfaces/models/service";
import { validateService } from "./base-validate-service";
import { billSplitError } from "../../utils/error-utils";

/**
 * Validate a service object before updating
 * @param {string} uid id of user making request
 * @param {Service} service Service to be validated
 */
export function validateUpdateService(uid: string, service: Service) {

    if (!service.id) {
        throw billSplitError(400, "Service is missing id")
    }
    validateService(uid, service)
}