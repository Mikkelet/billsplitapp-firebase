import { Request, Response } from "firebase-functions";
import { getGroupById } from "../collections/group-collection";
import { deleteService } from "../collections/services-collection";
import { Group } from "../interfaces/models/group";
import { handleError } from "../utils/error-utils";
import { validateUserMembership } from "../middleware/validate-user-membership";
import logRequest from "../utils/log-utils";

const deleteServiceImpl = async (req: Request, res: Response, uid: string) => {
    logRequest(req)
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

export default deleteServiceImpl