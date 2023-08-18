import Debt from "../../interfaces/models/debt";
import { Event } from "../../interfaces/models/events";

export interface GroupV3 {
    id: string;
    name: string;
    people: string[];
    pastMembers: string[],
    createdBy: string;
    timestamp: string;
    debts: Debt[] | undefined;
    latestEvent: Event | undefined | null;
    defaultCurrency: string,
}
