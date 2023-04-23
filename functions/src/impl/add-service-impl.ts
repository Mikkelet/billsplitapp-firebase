import { Request, Response } from "firebase-functions";
import { getGroupById } from "../collections/group-collection";
import { addService } from "../collections/services-collection";
import { AddServiceRequest, AddServiceResponse } from "../interfaces/add-service"
import { ServiceDTO } from "../interfaces/dto/service-dto";
import { Group } from "../interfaces/models/group";
import { convertDTOtoService, Service } from "../interfaces/models/service";
import { validateAddService } from "../middleware/service/add-service-validator";

export const addServiceImpl = async (req: Request, res: Response, uid: string) => {
    const body = req.body as AddServiceRequest
    const groupId = body.groupId
    const serviceDto: ServiceDTO = body.service
    const service: Service = convertDTOtoService(groupId, serviceDto)
    console.log("request", body)

    if (!validateAddService(res, uid, service)) {
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

        const addServiceResponse = await addService(groupId, service)
        serviceDto.id = addServiceResponse.id
        const response: AddServiceResponse = {
            service: serviceDto,
        }

        res.status(200).send(response)
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}