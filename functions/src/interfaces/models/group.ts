import { GroupDTO } from "../dto/group-dto";
import { Event, convertDTOtoEvent } from "./events";

export interface Group {
    id: string;
    name: string;
    people: string[];
    pastMembers: string[],
    createdBy: string;
    timestamp: string;
    latestEvent: Event | undefined | null;
    defaultCurrency: string,
}

/**
 * Convert data from database to data readable by frontend
 * @param {string} createdByUid userId for createdBy
 * @param {Group} groupDTO Group to convert
 * @return {GroupDTO} return converted group
 */
export function convertDTOtoGroup(createdByUid: string, groupDTO: GroupDTO): Group {
    let latestEvent: Event | null = null
    if (groupDTO.latestEvent !== null) {
        latestEvent = convertDTOtoEvent(createdByUid, groupDTO.latestEvent)
    }
    return {
        id: groupDTO.id,
        name: groupDTO.name,
        timestamp: groupDTO.timestamp,
        createdBy: createdByUid,
        pastMembers: groupDTO.pastMembers.map((m) => m.id),
        people: groupDTO.people.map((p) => p.id),
        latestEvent: latestEvent,
        defaultCurrency: groupDTO.defaultCurrency,
    }
}