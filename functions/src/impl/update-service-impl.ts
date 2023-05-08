import { Request, Response } from "firebase-functions";
import { updateService } from "../collections/services-collection";
import { ServiceDTO } from "../interfaces/dto/service-dto";
import { convertDTOtoService, Service } from "../interfaces/models/service";
import { UpdateServiceRequest } from "../interfaces/update-service";
import { validateUpdateService } from "../middleware/service/update-service-validator";
import validateUserMembership from "../middleware/validate-user-membership";
import { getGroupById } from "../collections/group-collection";
import logRequest from "../utils/log-utils";

const updateServiceImpl = async (req: Request, res: Response, uid: string) => {
    logRequest(req)
    const groupId = req.params.groupId;
    const body = req.body as UpdateServiceRequest
    const serviceDto: ServiceDTO = body.service

    try {
        const service: Service = convertDTOtoService(serviceDto)

        validateUpdateService(uid, service)
        const group = await getGroupById(groupId)
        validateUserMembership(uid, group)

        await updateService(groupId, service)

        res.status(204).send()
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}

export default updateServiceImpl