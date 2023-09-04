import { Group } from "../../interfaces/models/group";
import { GroupV4 } from "../models/group_v4";
import { convertEventV4ToV5 } from "./convert_events_v4_v5";

/**
 * conver V2 to V3
 * @param {GroupV2} group
 * @return {GroupV3} group
 */
export function convertGroupV4toV5(group: GroupV4): Group {    
    return {
        id: group.id,
        createdBy: group.createdBy,
        latestEvent: convertEventV4ToV5(group.latestEvent),
        name: group.name,
        pastMembers: group.pastMembers,
        people: group.people,
        timestamp: group.timestamp,
        defaultCurrency: group.defaultCurrency,
    }
}