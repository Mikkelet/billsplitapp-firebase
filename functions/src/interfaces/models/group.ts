import { convertDebtToDTO } from "../dto/debt-dto";
import { GroupDTO } from "../dto/group-dto";
import { Debt } from "./debt";

export interface Group {
    id: string;
    name: string;
    people: string[];
    createdBy: string;
    timeStamp: string;
    debts: Debt[] | undefined;
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
        timeStamp: groupDTO.timeStamp,
        createdBy: createdByUid,
        people: groupDTO.people.map((p) => p.id),
        debts: groupDTO.debts.map((dto) => convertDebtToDTO(dto)),
    }
}