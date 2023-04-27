import { Request, Response } from "firebase-functions";
import { getGroupById } from "../collections/group-collection";
import { deleteService } from "../collections/services-collection";
import { Group } from "../interfaces/models/group";
import { handleError } from "../utils/error-utils";
import { validateUserMembership } from "../middleware/validate-user-membership";

export const deleteServiceImpl = async (req: Request, res: Response, uid: string) => {
    const groupId: string = req.params.groupId
    const serviceId: string = req.params.serviceId

    try {
        const group: Group = await getGroupById(groupId);
        validateUserMembership(uid, group)

        await deleteService(groupId, serviceId)

        res.status(204).send()
    } catch (e) {
        handleError(e, res)
    }
}