import Debt from "../../../interfaces/models/debt";
import { EventV3 } from "../event/event_v3";

/**
 * Changes
 * Renamed timeStamp -> timestamp
 * removed individualExpenses
 * added defaultCurrency
 */
export interface GroupV3 {
    id: string;
    name: string;
    people: string[];
    pastMembers: string[],
    createdBy: string;
    timestamp: string;
    debts: Debt[] | undefined;
    latestEvent: EventV3 | null;
    defaultCurrency: string,
}
