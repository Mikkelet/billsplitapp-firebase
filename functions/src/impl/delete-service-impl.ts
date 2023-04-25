import { Request, Response } from "firebase-functions";
import { getGroupById } from "../collections/group-collection";
import { deleteService } from "../collections/services-collection";
import { Group } from "../interfaces/models/group";

export const deleteServiceImpl = async (req: Request, res: Response, uid: string) => {
    const groupId = req.params.groupId
    const serviceId = req.params.serviceId

    try {
        const group: Group = await getGroupById(groupId);
        const findUid: string | undefined = group.people.find((id) => id === uid)

        if (findUid === undefined) {
            console.log("Token userid not found in group", { groupId: groupId, uid: uid });
            res.status(404).send("Could not find group")
            return
        }

        await deleteService(groupId, serviceId)

        res.status(204).send()
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}