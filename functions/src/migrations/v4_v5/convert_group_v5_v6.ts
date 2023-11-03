import { GroupV5 } from "../models/group/group_v5";
import { GroupV6 } from "../models/group/group_v6";
import { convertEventV4ToV5 } from "./convert_event_v4_v5";

/**
 * convert V5 to V6
 * @param {GroupV5} group
 * @return {GroupV6} group
 */
export function convertGroupV5toV6(group: GroupV5): GroupV6 {
    return {
        id: group.id,
        createdBy: group.createdBy,
        latestEvent: convertEventV4ToV5(group.latestEvent),
        lastUpdated: Date.now(),
        coverImageUrl: group.coverImageUrl,
        name: group.name,
        pastMembers: group.pastMembers,
        people: group.people,
        timestamp: group.timestamp,
        defaultCurrency: group.defaultCurrency,
    }
}