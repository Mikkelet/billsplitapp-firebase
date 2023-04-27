import { PersonDTO } from "../interfaces/dto/person-dto"
import { billSplitError } from "../utils/error-utils"

/**
 * Validate if event/group is created by same use as request sender
 * @param {string} uid uid to request
 * @param {{ createdBy: PersonDTO }} dto dto with createdBy field
 */
export function validateCreatedBy(uid: string, dto: { createdBy: PersonDTO }) {
    if (dto.createdBy.id !== uid) {
        console.error(
            "User trying to insert on behalf of another user",
            { uid: uid, createdBy: dto.createdBy })
        throw billSplitError(400, "Insert failed")
    }
}