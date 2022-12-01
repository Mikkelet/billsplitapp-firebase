import { Request, Response } from "firebase-functions";
import { groupCollection, userCollection } from "../collections";
import AddGroupRequest from "../interfaces/add-group";
import { convertDTOtoGroup } from "../interfaces/models/group";

export const addGroupImpl = async (req: Request, res: Response) => {
    const body = req.body as AddGroupRequest;
    console.log(body);
    const groupDTO = body.group;
    const groupName = groupDTO.name;
    if (!groupName) res.status(400).send("missing groupName");
    if (!groupDTO.people || groupDTO.people.length === 0) {
        res.status(400).send("No people included");
    }

    try {
        for await (const person of groupDTO.people) {
            if (person.id === "") {
                person.id = userCollection.doc().id;
            }
            await userCollection.doc(person.id).set(person);
        }
        groupDTO.id = groupCollection.doc().id;
        const groupData = convertDTOtoGroup(groupDTO);
        await groupCollection.doc(groupData.id).set(groupData);
        res.status(200).send(groupDTO);
    } catch (e) {
        console.error(e);
        res.send(500).send(e);
    }
}