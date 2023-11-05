import { Request, Response } from "firebase-functions";
import { convertGroupToDTO } from "../interfaces/dto/group-dto";
import { GetGroupRequest, GetGroupResponse } from "../interfaces/get-group";
import { getGroupById } from "../collections/group-collection";
import { getPeople } from "../collections/user-collection";
import { Group } from "../interfaces/models/group";
import { Person } from "../interfaces/models/person";
import { handleError } from "../utils/error-utils";
import validateUserMembership from "../middleware/validators/validate-user-membership";
import logRequest from "../utils/log-utils";

const getGroupImpl = async (req: Request, res: Response, uid: string) => {
    logRequest(req)
    const params = req.params as unknown as GetGroupRequest
    const groupId = params.groupId

    try {
        const group: Group = await getGroupById(groupId);
        validateUserMembership(uid, group)

        const uids: string[] = [...group.pastMembers, ...group.people, ...group.invites]
        const people: Person[] = await getPeople(uids);
        const groupDto = convertGroupToDTO(group, people);

        const response: GetGroupResponse = {
            group: groupDto,
        }
        console.log("response", JSON.stringify(response));
        res.status(200).send(response);
    } catch (e) {
        handleError(e, res)
    }
}

export default getGroupImpl