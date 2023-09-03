import { GroupV2 } from "../models/group_v2";
import { GroupV3 } from "../models/group_v3";
import { convertExpenseV2ToV3 } from "./convert_events_v2_v3";

/**
 * conver V2 to V3
 * @param {GroupV2} group
 * @return {GroupV3} group
 */
export function convertGroupV2toV3(group: GroupV2): GroupV3 {
    return {
        id: group.id,
        createdBy: group.createdBy,
        debts: group.debts,
        latestEvent: convertExpenseV2ToV3(group.latestEvent),
        name: group.name,
        pastMembers: group.pastMembers,
        people: group.people,
        timestamp: group.timeStamp,
        defaultCurrency: "dkk",
    }
}