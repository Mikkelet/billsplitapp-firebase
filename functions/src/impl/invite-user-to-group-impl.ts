import { Request, Response } from "firebase-functions";
import logRequest from "../utils/log-utils";
import { Group } from "../interfaces/models/group";
import { getGroupById, updateGroup } from "../collections/group-collection";
import { LeaveGroupResponse } from "../interfaces/leave-group";
import { convertGroupToDTO } from "../interfaces/dto/group-dto";
import { Person } from "../interfaces/models/person";
import { getPeople } from "../collections/user-collection";
import { AddToGroupRequest } from "../interfaces/add-to-group";
import validateUserMembership from "../middleware/validators/validate-user-membership";
import { handleError } from "../utils/error-utils";
import { arrayContains, removeFromArray } from "../utils/list-utils";

const inviteToGroupImpl = async (req: Request, res: Response, uid: string) => {
    logRequest(req)
    const body = req.body as AddToGroupRequest;
    const groupId = body.groupId
    const newUserId = body.userId;

    try {
        const group: Group = await getGroupById(groupId);
        validateUserMembership(uid, group)

        if (arrayContains(group.invites, newUserId)) {
            const invitesWithoutUid = removeFromArray(group.invites, newUserId)
            // Apply new lists
            group.people = [...new Set([...group.people, newUserId])]
            group.pastMembers = removeFromArray(group.pastMembers, newUserId)
            group.invites = invitesWithoutUid
        } else {
            group.invites = [...group.invites, newUserId]
        }

        // get people of uids
        const allUids: string[] = [...group.people, ...group.pastMembers, ...group.invites]
        const allPeople: Person[] = await getPeople(allUids)

        // update group
        await updateGroup(group)

        const response: LeaveGroupResponse = {
            group: convertGroupToDTO(group, allPeople),
        }

        console.log("response", response);
        res.status(200).send(response);
    } catch (e) {
        handleError(e, res)
    }
}

export default inviteToGroupImpl
