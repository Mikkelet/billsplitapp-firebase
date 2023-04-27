import { Request, Response } from "firebase-functions";
import { Group } from "../interfaces/models/group";
import { getGroupById, updateGroup } from "../collections/group-collection";
import { LeaveGroupResponse } from "../interfaces/leave-group";
import { convertGroupToDTO } from "../interfaces/dto/group-dto";
import { Person } from "../interfaces/models/person";
import { getPeople } from "../collections/user-collection";
import { handleError } from "../utils/error-utils";

export const leaveGroupImpl = async (req: Request, res: Response, uid: string) => {
    const body = req.params.groupId
    const groupId = body
    console.log("leaveGroup request", groupId);

    try {
        const group: Group = await getGroupById(groupId);

        // create new people list without uid
        const peopleWithoutUid: string[] = group.people.filter((p) => p !== uid)

        // create new pastMembers list with uid
        const pastMemberWithUid: string[] = [...new Set([...group.pastMembers, uid])]

        // Apply new lists
        group.people = peopleWithoutUid
        group.pastMembers = pastMemberWithUid

        // get people of uids
        const allUids: string[] = [...peopleWithoutUid, ...pastMemberWithUid]
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