import { Request, Response } from "firebase-functions";
import { addGroup } from "../collections/group-collection";
import { AddGroupRequest, AddGroupResponse } from "../interfaces/add-group";
import { GroupDTO } from "../interfaces/dto/group-dto";
import { convertDTOtoGroup } from "../interfaces/models/group";

export const addGroupImpl = async (req: Request, res: Response, createdBy: string) => {
    const body = req.body as AddGroupRequest;
    console.log("request", body);

    const groupDTO: GroupDTO = body.group;

    if (!groupDTO.name) {
        res.status(400).send("missing groupName");
        return
    }

    if (!groupDTO.people || groupDTO.people.length === 0) {
        res.status(400).send("No people included");
        return
    }

    const groupPeopleIds: string[] = groupDTO.people.map((dto) => dto.id)
    const findUid: string | undefined = groupPeopleIds.find((id) => id === createdBy)
    if (findUid === undefined) {
        res.status(400).send("You are not part of the group you're creating");
        return
    }

    if (groupDTO.createdBy.id !== createdBy) {
        console.error(
            "User trying to create a group on behalf of another user",
            { uid: createdBy, createdBy: groupDTO.createdBy })
        res.status(400).send("Group was not created")
        return
    }

    try {
        const group = await addGroup(convertDTOtoGroup(createdBy, groupDTO));
        groupDTO.id = group.id;

        const response: AddGroupResponse = { group: groupDTO };
        console.log("response", response);
        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}