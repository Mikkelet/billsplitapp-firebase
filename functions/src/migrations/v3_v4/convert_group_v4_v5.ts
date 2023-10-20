import { GroupV4 } from "../models/group/group_v4";
import { GroupV5 } from "../models/group/group_v5";
import { convertEventV3ToV4 } from "./convert_events_v3_v4";

/**
 * conver V2 to V3
 * @param {GroupV2} group
 * @return {GroupV3} group
 */
export function convertGroupV4toV5(group: GroupV4): GroupV5 {
    return {
        id: group.id,
        createdBy: group.createdBy,
        latestEvent: convertEventV3ToV4(group.latestEvent),
        coverImageUrl: "",
        name: group.name,
        pastMembers: group.pastMembers,
        people: group.people,
        timestamp: group.timestamp,
        defaultCurrency: group.defaultCurrency,
    }
}