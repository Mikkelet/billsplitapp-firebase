import { findPerson } from "../../collections/user-collection";
import { Group } from "../models/group";
import { PersonWithId } from "../models/person";
import { convertDebtToDTO, DebtDTO } from "./debt-dto";
import { PersonDTO } from "./person-dto";

export interface GroupDTO {
    id: string;
    name: string;
    people: PersonDTO[];
    createdBy: PersonDTO;
    timeStamp: string;
    debts: DebtDTO[],
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
    return {
        id: group.id,
        name: group.name,
        timeStamp: group.timeStamp,
        createdBy: findPerson(people, group.createdBy),
        people: people,
        debts: debts,
    }
}