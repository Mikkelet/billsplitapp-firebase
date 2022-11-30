import { findPerson } from "../../utils";
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
 * @param {Person[]} people people who are part of the group
 * @return {GroupDTO} return converted group
 */
export function convertGroupToDTO(group: Group, people: Person[]): GroupDTO {
    return {
        id: group.id,
        name: group.name,
        timeStamp: group.timeStamp,
        createdBy: findPerson(people, group.createdBy),
        people: people,
    }
}