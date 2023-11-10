import { GroupV6 } from "../models/group/group_v6";
import { GroupV7 } from "../models/group/group_v7";
import { convertEventV4ToV5 } from "../v4_v5/convert_event_v4_v5";

/**
 * convert V6 to V7
 * @param {GroupV6} group
 * @return {Group} group
 */
export function convertGroupV6toV7(group: GroupV6): GroupV7 {
    return {
        id: group.id,
        createdBy: group.createdBy,
        latestEvent: convertEventV4ToV5(group.latestEvent!),
        lastUpdated: Date.now(),
        coverImageUrl: group.coverImageUrl,
        name: group.name,
        pastMembers: group.pastMembers,
        people: group.people,
        invites: [],
        timestamp: group.timestamp,
        defaultCurrency: group.defaultCurrency,
    }
}