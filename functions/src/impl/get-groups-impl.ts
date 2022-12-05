import { Request, Response } from "firebase-functions";
import { findPerson, getPeople } from "../utils";
import { GroupDTO } from "../interfaces/dto/group-dto";
import { GetGroupsRequest, GetGroupsResponse } from "../interfaces/get-groups";
import { getGroupsByUser } from "../collections/group-collection";

export const getGroupsImpl = async (req: Request, res: Response) => {
    const body = req.body as GetGroupsRequest;
    const uid = body.userId as string;
    console.log(body);

    try {
        const groups = await getGroupsByUser(uid);
        const uids: string[] = groups.flatMap((group) => group.people);
        const distinctUids: string[] = [...new Set(uids)];
        const people = await getPeople(distinctUids);

        const dtos: GroupDTO[] = groups.map((group) => {
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
        res.status(500).send(e);
    }
}