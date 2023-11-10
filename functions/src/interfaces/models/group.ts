import { GroupDTO } from "../dto/group-dto";

export interface Group {
    id: string;
    name: string;
    people: string[];
    pastMembers: string[];
    invites: string[];
    coverImageUrl: string;
    createdBy: string;
    timestamp: string;
    lastUpdated: number;
    defaultCurrency: string;
}

/**
 * Convert data from database to data readable by frontend
 * @param {string} createdByUid userId for createdBy
 * @param {Group} groupDTO Group to convert
 * @return {GroupDTO} return converted group
 */
export function convertDTOtoGroup(createdByUid: string, groupDTO: GroupDTO): Group {
    return {
        id: groupDTO.id,
        name: groupDTO.name,
        coverImageUrl: groupDTO.coverImageUrl,
        timestamp: groupDTO.timestamp,
        createdBy: createdByUid,
        lastUpdated: groupDTO.lastUpdated,
        pastMembers: groupDTO.pastMembers.map((m) => m.id),
        people: groupDTO.people.map((p) => p.id),
        invites: groupDTO.invites.map((p) => p.id),
        defaultCurrency: groupDTO.defaultCurrency,
    }
}