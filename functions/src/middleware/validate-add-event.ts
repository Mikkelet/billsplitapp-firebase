import { AddEventRequest } from "../interfaces/add-event";
import { billSplitError } from "../utils/error-utils";

/**
 * Validates request data of AddEvent
 * @param {AddEventRequest} request requst to validate
 * @param {string} uid uid of request
 */
export default function validateAddEvent(request: AddEventRequest, uid: string) {
    const event = request.event

    if (event.id === "" && event.createdBy.id !== uid) {
        console.error(
            "User trying to create an event on behalf of another user",
            { uid: uid, createdBy: event.createdBy },
        )
        throw billSplitError(400, "Event was not created");
    }
}