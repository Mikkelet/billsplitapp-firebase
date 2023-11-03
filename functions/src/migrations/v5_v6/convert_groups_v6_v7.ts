import { Group } from "../../interfaces/models/group";
import { GroupV6 } from "../models/group/group_v6";

/**
 * convert V6 to V7
 * @param {GroupV6} group
 * @return {Group} group
 */
export function convertGroupV6toV7(group: GroupV6): Group {
    return {
        id: group.id,
        createdBy: group.createdBy,
        latestEvent: group.latestEvent,
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