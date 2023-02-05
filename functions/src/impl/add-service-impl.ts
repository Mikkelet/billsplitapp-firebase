import { Request, Response } from "firebase-functions";
import { getGroupById } from "../collections/group-collection";
import { addService } from "../collections/services-collection";
import { AddServiceRequest, AddServiceResponse } from "../interfaces/add-service"
import { ServiceDTO } from "../interfaces/dto/service-dto";
import { Group } from "../interfaces/models/group";
import { convertDTOtoService, Service } from "../interfaces/models/service";

export const addServiceImpl = async (req: Request, res: Response, uid: string) => {
    const body = req.body as AddServiceRequest
    const groupId = body.groupId
    const serviceDto: ServiceDTO = body.service
    const service: Service = convertDTOtoService(serviceDto)

    if (!service.name) {
        res.status(400).send("missing name");
        return
    }
    if (!service.participants || service.participants.length === 0) {
        res.status(400).send("missing participants");
        return
    }
    if (service.monthlyExpense <= 0) {
        res.status(400).send("Monthly expense must be positive number");
        return
    }
    if (uid !== service.createdBy) {
        console.error(
            "User trying to create an event on behalf of another user",
            { uid: uid, createdBy: serviceDto.createdBy },
        )
        res.status(400).send("Event was not created")
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