import { Request, Response } from "firebase-functions";
import { Group } from "../interfaces/models/group";
import { getGroupById, updateGroup } from "../collections/group-collection";
import { LeaveGroupResponse } from "../interfaces/leave-group";
import { convertGroupToDTO } from "../interfaces/dto/group-dto";
import { Person } from "../interfaces/models/person";
import { getPeople } from "../collections/user-collection";
import { AddToGroupRequest } from "../interfaces/add-to-group";
import { validateUserMembership } from "../middleware/validate-user-membership";
import logRequest from "../utils/log-utils";

export const addToGroupImpl = async (req: Request, res: Response, uid: string) => {
    logRequest(req)
    const body = req.body as AddToGroupRequest;
    const groupId = req.params.groupId

    try {
        const group: Group = await getGroupById(groupId);
        validateUserMembership(uid, group)

        // create new pastMembers list without uid
        const peopleWithUid: string[] = [...new Set([...group.pastMembers, uid])]

        // create new people list with uid
        const pastMembersWithoutUid: string[] = group.people.filter((p) => p !== body.userId)

        // Apply new lists
        group.people = peopleWithUid
        group.pastMembers = pastMembersWithoutUid

        // get people of uids
        const allUids: string[] = [...peopleWithUid, ...pastMembersWithoutUid]
        const allPeople: Person[] = await getPeople(allUids)

        // update group
        await updateGroup(group)

        const response: LeaveGroupResponse = {
            group: convertGroupToDTO(group, allPeople),
        }

        console.log("response", response);
        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}