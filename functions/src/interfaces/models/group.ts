import { findPerson } from "../../utils";
import Person from "./person";

export interface Group {
    id: string;
    name: string;
    people: string[];
    createdBy: string;
    timeStamp: string;
}

export interface GroupDTO {
    id: string;
    name: string;
    people: Person[];
    createdBy: Person;
    timeStamp: string;
}

/**
 * Convert data from database to data readable by frontend
 * @param {Group} group Group to convert
 * @param {Person[]} people people who are part of the group
 * @return {GroupDTO} return converted group
 */
export function getGroupDTO(group: Group, people: Person[]): GroupDTO {
    return {
        id: group.id,
        name: group.name,
        timeStamp: group.timeStamp,
        createdBy: findPerson(people, group.createdBy),
        people: people,
    }
}