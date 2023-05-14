import { GroupDTO } from "../dto/group-dto";
import Debt from "./debt";
import { convertDTOtoEvent, Event } from "./events";

export interface Group {
    id: string;
    name: string;
    people: string[];
    pastMembers: string[],
    createdBy: string;
    timestamp: string;
    debts: Debt[] | undefined;
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
        debts: groupDTO.debts,
        latestEvent: latestEvent,
        defaultCurrency: groupDTO.defaultCurrency
    }
}

// V2
export interface GroupV2 {
    id: string;
    name: string;
    people: string[];
    pastMembers: string[],
    createdBy: string;
    timeStamp: string;
    debts: Debt[] | undefined;
    individualExpense: any[] | undefined,
    latestEvent: Event | undefined | null;
}

export function convertGroupV2toV3(group: GroupV2): Group {
    return {
        id: group.id,
        createdBy: group.createdBy,
        debts: group.debts,
        latestEvent: group.latestEvent,
        name: group.name,
        pastMembers: group.pastMembers,
        people: group.people,
        timestamp: group.timeStamp,
        defaultCurrency: "dkk",
    }
}