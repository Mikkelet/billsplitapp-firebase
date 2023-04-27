import { findPerson } from "../../collections/user-collection";
import { Group } from "../models/group";
import { PersonWithId } from "../models/person";
import { convertDebtToDTO, DebtDTO } from "./debt-dto";
import { convertEventToDTO, EventDTO } from "./event-dto";
import { PersonDTO } from "./person-dto";

export interface GroupDTO {
    id: string;
    name: string;
    people: PersonDTO[];
    pastMembers: PersonDTO[];
    createdBy: PersonDTO;
    timeStamp: string;
    debts: DebtDTO[],
    latestEvent: EventDTO | null;
}

/**
 * Convert data from database to data readable by frontend
 * @param {GroupDTO} group Group to convert
 * @param {PersonDTO[]} people people who are part of the group
 * @return {GroupDTO} return converted group
 */
export function convertGroupToDTO(group: Group, people: PersonWithId[]): GroupDTO {
    const debts: DebtDTO[] = group.debts === undefined ? [] : group.debts
        .map((debt) => convertDebtToDTO(debt));

    let latestEvent: EventDTO | null = null
    if (group.latestEvent !== null && group.latestEvent !== undefined) {
        latestEvent = convertEventToDTO(group.latestEvent, people)
    }

    return {
        id: group.id,
        name: group.name,
        timeStamp: group.timeStamp,
        pastMembers: group.pastMembers.map((pm) => findPerson(people, pm)),
        createdBy: findPerson(people, group.createdBy),
        people: group.people.map((p) => findPerson(people, p)),
        debts: debts,
        latestEvent: latestEvent,
    }
}