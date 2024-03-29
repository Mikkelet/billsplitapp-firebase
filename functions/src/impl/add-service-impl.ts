import { Request, Response } from "firebase-functions";
import { getGroupById } from "../collections/group-collection";
import { addService } from "../collections/services-collection";
import { AddServiceRequest, AddServiceResponse } from "../interfaces/add-service"
import { ServiceDTO } from "../interfaces/dto/service-dto";
import { Group } from "../interfaces/models/group";
import { convertDTOtoService, Service } from "../interfaces/models/service";
import { validateAddService } from "../middleware/service/add-service-validator";
import { handleError } from "../utils/error-utils";
import { validateUserMembership } from "../middleware/validate-user-membership";

export const addServiceImpl = async (req: Request, res: Response, uid: string) => {
    const body = req.body as AddServiceRequest
    const groupId = req.params.groupId
    const serviceDto: ServiceDTO = body.service
    const service: Service = convertDTOtoService(serviceDto)
    console.log("add service", { body: body }, { groupId: groupId })
    try {
        validateAddService(uid, service)
        const group: Group = await getGroupById(groupId);
        validateUserMembership(uid, group)

        const addServiceResponse = await addService(groupId, service)
        serviceDto.id = addServiceResponse.id
        const response: AddServiceResponse = {
            service: serviceDto,
        }

        res.status(200).send(response)
    } catch (e) {
        handleError(e, res)
    }
}