import { Request, Response } from "firebase-functions";
import { groupCollection } from "../collections";
import { Group } from "../interfaces/models/group";
import { findPerson, getPeople } from "../utils";
import { GroupDTO } from "../interfaces/dto/group-dto";
import GetGroupsRequest from "../interfaces/get-groups-request";
import GetGroupsResponse from "../interfaces/get-groups-response";

export const getGroupsImpl = async (req: Request, res: Response) => {
    const body = req.body as GetGroupsRequest;
    const uid = body.userId as string;
    console.log(body);

    try {
        const query = await groupCollection
            .where("people", "array-contains", uid).get();
        const groupsData: Group[] =
            query.docs.map((doc) => doc.data() as Group);
        const uids: string[] = groupsData.flatMap((group) => group.people);
        const distinctUids: string[] = [...new Set(uids)];
        const people = await getPeople(distinctUids);

        const dtos: GroupDTO[] = groupsData.map((group) => {
            return {
                id: group.id,
                name: group.name,
                people: group.people.map((person) =>
                    findPerson(people, person)),
                timeStamp: group.timeStamp,
                createdBy: findPerson(people, group.createdBy),
            } as GroupDTO;
        })

        const response: GetGroupsResponse = {
            groups: dtos,
        }
        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        res.send(500).send(e);
    }
}