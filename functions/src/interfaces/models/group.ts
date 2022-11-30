import { findPerson } from "../../utils";
import { GroupDTO } from "../dto/group-dto";

export interface Group {
    id: string;
    name: string;
    people: string[];
    createdBy: string;
    timeStamp: string;
}

/**
 * Convert data from database to data readable by frontend
 * @param {Group} groupDTO Group to convert
 * @return {GroupDTO} return converted group
 */
export function convertDTOtoGroup(groupDTO: GroupDTO): Group {
    return {
        id: groupDTO.id,
        name: groupDTO.name,
        timeStamp: groupDTO.timeStamp,
        createdBy: findPerson(groupDTO.people, groupDTO.createdBy.id).id,
        people: groupDTO.people.map((p) => p.id),
    }
}