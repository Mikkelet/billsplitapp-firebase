import { Response } from "express";
import { Group } from "../../interfaces/models/group";
import { GetGroupsResponse } from "../../interfaces/get-groups";
import { findPerson, getPeople } from "../../collections/user-collection";
import { convertGroupToDTO, GroupDTO } from "../../interfaces/dto/group-dto";

/**
 * Helper function that packages and sends groups to response object
 * @param {Response} res
 * @param {Group[]} groups
 */
export default async function sendGroups(res: Response, groups: Group[]) {
    if (groups.length === 0) {
        const emptyResponse: GetGroupsResponse = {
            groups: [],
        }
        res.status(200).send(emptyResponse);
        return
    }

    const uids: string[] = groups.flatMap((group) =>
        [...group.people, ...group.pastMembers, ...group.invites]);
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
}