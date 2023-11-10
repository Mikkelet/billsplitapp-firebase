import { Group } from "../../interfaces/models/group";
import { GroupV7 } from "../models/group/group_v7";

/**
 * Convert groupV7 to V8
 * @param {GroupV7} group group to be converted
 * @return {Group} converted group
 */
export function convertGroupV7V8(group: GroupV7): Group {
    return {
        id: group.id,
        name: group.name,
        createdBy: group.createdBy,
        defaultCurrency: group.defaultCurrency,
        invites: group.invites,
        lastUpdated: group.lastUpdated,
        coverImageUrl: group.coverImageUrl,
        pastMembers: group.pastMembers,
        people: group.people,
        timestamp: group.timestamp,
    }
}