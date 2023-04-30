import { Request, Response } from "firebase-functions";
import { addGroup } from "../collections/group-collection";
import { AddGroupRequest, AddGroupResponse } from "../interfaces/add-group";
import { GroupDTO } from "../interfaces/dto/group-dto";
import { convertDTOtoGroup } from "../interfaces/models/group";
import { handleError } from "../utils/error-utils";
import { validateGroup } from "../middleware/group/validate-group";
import { validateUserMembership } from "../middleware/validate-user-membership";
import { validateCreatedBy } from "../middleware/validate-created-by";
import logRequest from "../utils/log-utils";

export const addGroupImpl = async (req: Request, res: Response, uid: string) => {
    logRequest(req)
    const body = req.body as AddGroupRequest;
    const groupDTO: GroupDTO = body.group;

    try {
        const group = convertDTOtoGroup(uid, groupDTO)

        validateGroup(group)
        validateUserMembership(uid, group)
        validateCreatedBy(uid, groupDTO)

        const newGroup = await addGroup(group);
        groupDTO.id = newGroup.id;

        const response: AddGroupResponse = { group: groupDTO };
        console.log("response", response);
        res.status(200).send(response);
    } catch (e) {
        handleError(e, res)
    }
}