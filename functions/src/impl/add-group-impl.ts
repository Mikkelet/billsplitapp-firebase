import { Request, Response } from "firebase-functions";
import { addGroup, updateGroup } from "../collections/group-collection";
import { AddGroupRequest, AddGroupResponse } from "../interfaces/add-group";
import { GroupDTO } from "../interfaces/dto/group-dto";
import { convertDTOtoGroup } from "../interfaces/models/group";
import { handleError } from "../utils/error-utils";
import validateGroup from "../middleware/group/validate-group";
import validateUserMembership from "../middleware/validators/validate-user-membership";
import validateCreatedBy from "../middleware/validators/validate-created-by";
import logRequest from "../utils/log-utils";

const addGroupImpl = async (req: Request, res: Response, uid: string) => {
    logRequest(req)
    try {
        const body = req.body as AddGroupRequest;
        const groupDTO: GroupDTO = body.group;

        const group = convertDTOtoGroup(uid, groupDTO)

        validateGroup(group)
        validateUserMembership(uid, group)
        validateCreatedBy(uid, groupDTO)

        if (groupDTO.id === "") {
            const newGroup = await addGroup(group);
            groupDTO.id = newGroup.id;
        } else {
            await updateGroup(group);
        }

        const response: AddGroupResponse = { group: groupDTO };
        console.log("response", response);
        res.status(200).send(response);
    } catch (e) {
        handleError(e, res)
    }
}

export default addGroupImpl