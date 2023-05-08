import { Group } from "../interfaces/models/group";
import { billSplitError } from "../utils/error-utils";

/**
 * Validates user is member of group
 * @param {string} uid id of user
 * @param {Group} group id of group
 */
export default function validateUserMembership(uid: string, group: Group) {
    const findUid: string | undefined = group.people.find((id) => id === uid)

    if (findUid === undefined) {
        console.log("Token userid not found in group", { groupId: group.id, uid: uid });
        throw billSplitError(400, "You are not part of this group")
    }
}