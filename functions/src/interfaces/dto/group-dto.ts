import { findPerson } from "../../collections/user-collection";
import { Group } from "../models/group";
import { PersonWithId } from "../models/person";
import { convertEventToDTO, EventDTO } from "./event-dto";
import { PersonDTO } from "./person-dto";

export interface GroupDTO {
    id: string;
    name: string;
    coverImageUrl: string;
    people: PersonDTO[];
    pastMembers: PersonDTO[];
    invites: PersonDTO[];
    createdBy: PersonDTO;
    timestamp: string;
    latestEvent: EventDTO | null;
    lastUpdated: number;
    defaultCurrency: string;
}

/**
 * Convert data from database to data readable by frontend
 * @param {GroupDTO} group Group to convert
 * @param {PersonDTO[]} people people who are part of the group
 * @return {GroupDTO} return converted group
 */
export function convertGroupToDTO(group: Group, people: PersonWithId[]): GroupDTO {

    let latestEvent: EventDTO | null = null
    if (group.latestEvent !== null && group.latestEvent !== undefined) {
        latestEvent = convertEventToDTO(group.latestEvent, people)
    }

    return {
        id: group.id,
        name: group.name,
        coverImageUrl: group.coverImageUrl,
        timestamp: group.timestamp,
        pastMembers: group.pastMembers.map((p) => findPerson(people, p)),
        invites: group.invites.map((p) => findPerson(people, p)),
        createdBy: findPerson(people, group.createdBy),
        people: group.people.map((p) => findPerson(people, p)),
        lastUpdated: group.lastUpdated,
        latestEvent: latestEvent,
        defaultCurrency: group.defaultCurrency,
    }
}