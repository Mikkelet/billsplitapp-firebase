import { Group } from "../../interfaces/models/group";
import { billSplitError } from "../../utils/error-utils";

/**
 * Validate group
 * @param {Group} group group to validate
 */
export default function validateGroup(group: Group) {
    if (!group.name) {
        throw billSplitError(400, "Missing group name");
    }
    if (!group.people || group.people.length === 0) {
        throw billSplitError(400, "Missing group memebers")
    }
}