import { Group } from "../models/group";
import Person from "../models/person";

export interface GroupDTO {
    id: string;
    name: string;
    people: Person[];
    createdBy: Person;
    timeStamp: string;
}

/**
 * Convert data from database to data readable by frontend
 * @param {GroupDTO} group Group to convert
 * @return {Group} return converted group
 */
export function getGroupDTO(group: GroupDTO): Group {
    return {
        id: group.id,
        name: group.name,
        timeStamp: group.timeStamp,
        createdBy: group.createdBy.id,
        people: group.people.map((p) => p.id),
    }
}