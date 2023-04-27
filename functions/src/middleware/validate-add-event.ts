import { AddEventRequest } from "../interfaces/add-event";
import { billSplitError } from "../utils/error-utils";

/**
 * Validates request data of AddEvent
 * @param {AddEventRequest} request requst to validate
 * @param {string} uid uid of request
 */
export function validateAddEvent(request: AddEventRequest, uid: string) {
    const debts = request.debts
    const event = request.event

    if (debts.length === 0) {
        throw billSplitError(400, "An unexptected error occurred. Please contact the developer!")
    }
    if (event.createdBy.id !== uid) {
        console.error(
            "User trying to create an event on behalf of another user",
            { uid: uid, createdBy: event.createdBy },
        )
        throw billSplitError(400, "Event was not created");
    }
}