import { Request, Response } from "firebase-functions";
import logRequest from "../utils/log-utils";
import { GroupInviteResponseRequest } from "../interfaces/group-invite-response";
import { getGroupById, updateGroup } from "../collections/group-collection";
import { billSplitError, handleError } from "../utils/error-utils";
import { arrayContains, removeFromArray } from "../utils/list-utils";

const respondToGroupInvite = async (req: Request, res: Response, uid: string) => {
    logRequest(req)

    try {
        const body = req.body as GroupInviteResponseRequest
        const groupId = body.groupId
        const accept = body.accept

        const group = await getGroupById(groupId)
        let invites = group.invites
        if (!arrayContains(invites, uid)) {
            throw billSplitError(500, "User not invited to group")
        }

        invites = removeFromArray(invites, uid)
        group.invites = invites
        if (accept) {
            group.people = [...new Set([...group.people, uid])]
            group.pastMembers = removeFromArray(group.pastMembers, uid)
        }
        await updateGroup(group)

        res.status(204).send()
    } catch (e) {
        console.error(e);
        handleError(e, res)
    }
}

export default respondToGroupInvite