import { Group } from "../../interfaces/models/group";
import { GroupV5 } from "../models/group/group_v5";
import { convertEventV4ToV5 } from "./convert_event_v4_v5";

/**
 * conver V2 to V3
 * @param {GroupV5} group
 * @return {Group} group
 */
export function convertGroupV5toV6(group: GroupV5): Group {
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