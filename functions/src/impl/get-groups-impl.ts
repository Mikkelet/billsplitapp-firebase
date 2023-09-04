import { Request, Response } from "firebase-functions";
import { convertGroupToDTO, GroupDTO } from "../interfaces/dto/group-dto";
import { GetGroupsResponse } from "../interfaces/get-groups";
import { getGroupsByUser } from "../collections/group-collection";
import { findPerson, getPeople } from "../collections/user-collection";
import { handleError } from "../utils/error-utils";
import logRequest from "../utils/log-utils";

const getGroupsImpl = async (req: Request, res: Response, uid: string) => {
    logRequest(req)    

    try {
        const groups = await getGroupsByUser(uid);
        if (groups.length === 0) {
            const emptyResponse: GetGroupsResponse = {
                groups: [],
            }
            res.status(200).send(emptyResponse);
            return
        }
        const uids: string[] = groups.flatMap((group) => [...group.people, ...group.pastMembers]);
        const distinctUids: string[] = [...new Set(uids)];
        const people = await getPeople(distinctUids);

        const dtos: GroupDTO[] = groups.map((group) => {
            const peopleInGroup = group.people.map((uid) => findPerson(people, uid))
            return convertGroupToDTO(group, peopleInGroup)
        })

        const response: GetGroupsResponse = {
            groups: dtos,
        }
        console.log("response", response);
        res.status(200).send(response);
    } catch (e) {
        console.error(e);
        handleError(e, res)
    }
}

export default getGroupsImpl