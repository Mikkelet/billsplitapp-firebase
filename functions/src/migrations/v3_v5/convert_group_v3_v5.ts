import { Group } from "../../interfaces/models/group";
import { GroupV3 } from "../models/group_v3";

/**
 * conver V2 to V3
 * @param {GroupV2} group
 * @return {GroupV3} group
 */
export function convertGroupV3toV5(group: GroupV3): Group {
    return {
        id: group.id,
        createdBy: group.createdBy,
        latestEvent: group.latestEvent,
        name: group.name,
        pastMembers: group.pastMembers,
        people: group.people,
        timestamp: group.timestamp,
        defaultCurrency: group.defaultCurrency,
    }
}