import { findPerson } from "../../collections/user-collection";
import { GroupDTO } from "../dto/group-dto";
import { convertDTOToPerson } from "./person";

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
    const people = groupDTO.people.map((pDTO) => convertDTOToPerson(pDTO));
    const createdBy = convertDTOToPerson(groupDTO.createdBy)
    return {
        id: groupDTO.id,
        name: groupDTO.name,
        timeStamp: groupDTO.timeStamp,
        createdBy: findPerson(people, createdBy.id).id,
        people: groupDTO.people.map((p) => p.id),
    }
}