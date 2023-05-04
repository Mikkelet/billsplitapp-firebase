import { PersonDTO } from "../interfaces/dto/person-dto"
import { billSplitError } from "../utils/error-utils"

// A new DTO must have an emprty id and a person that created it
type NewDTO = { id: string, createdBy: PersonDTO }

/**
 * Validate if new event/group is created by same use as request sender
 * 
 * @param {string} uid uid to request
 * @param {NewDTO} dto dto with createdBy field
 */
export function validateCreatedBy(uid: string, dto: NewDTO) {
    if (dto.id === "" && dto.createdBy.id !== uid) {
        console.error(
            "User trying to insert on behalf of another user",
            { uid: uid, createdBy: dto.createdBy })
        throw billSplitError(400, "Insert failed")
    }
}