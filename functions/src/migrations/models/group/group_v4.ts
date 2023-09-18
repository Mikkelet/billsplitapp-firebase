import Debt from "../../../interfaces/models/debt";
import { EventV3 } from "../event/event_v3";

/**
 * Changes
 * Update latestEents to type of EventV4
 */
export interface GroupV4 {
    id: string;
    name: string;
    people: string[];
    pastMembers: string[],
    createdBy: string;
    timestamp: string;
    debts: Debt[] | undefined;
    latestEvent: EventV3 | null;
    defaultCurrency: string;
}