import { Request, Response } from "firebase-functions";
import { getGroupById } from "../collections/group-collection";
import { updateService } from "../collections/services-collection";
import { ServiceDTO } from "../interfaces/dto/service-dto";
import { Group } from "../interfaces/models/group";
import { convertDTOtoService, Service } from "../interfaces/models/service";
import { UpdateServiceRequest } from "../interfaces/update-service";
import { validateUpdateService } from "../middleware/service/update-service-validator";

export const updateServiceImpl = async (req: Request, res: Response, uid: string) => {
    const body = req.body as UpdateServiceRequest
    const groupId = body.groupId
    const serviceDto: ServiceDTO = body.service
    const service: Service = convertDTOtoService(groupId, serviceDto)

    if(!validateUpdateService(res, uid, service)){
        return
    }

    try {
        const group: Group = await getGroupById(groupId);
        const findUid: string | undefined = group.people.find((id) => id === uid)

        if (findUid === undefined) {
            console.log("Token userid not found in group", { groupId: groupId, uid: uid });
            res.status(404).send("Could not find group")
            return
        }

        await updateService(groupId, service)

        res.status(204).send()
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}