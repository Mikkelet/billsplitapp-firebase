import { Request, Response } from "firebase-functions";
import { addGroup } from "../collections/group-collection";
import { AddGroupRequest, AddGroupResponse } from "../interfaces/add-group";
import { convertDTOtoGroup } from "../interfaces/models/group";

export const addGroupImpl = async (req: Request, res: Response) => {
    const body = req.body as AddGroupRequest;
    console.log("request", body);
    const groupDTO = body.group;
    const groupName = groupDTO.name;
    if (!groupName) res.status(400).send("missing groupName");
    if (!groupDTO.people || groupDTO.people.length === 0) {
        res.status(400).send("No people included");
    }

    try {
        const group = await addGroup(convertDTOtoGroup(groupDTO));
        groupDTO.id = group.id;

        const response: AddGroupResponse = { group: groupDTO };
        console.log("response", response);
        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
}