import Debt from "../../interfaces/models/debt";
import { EventV4 } from "./event_v4";

export interface GroupV4 {
    id: string;
    name: string;
    people: string[];
    pastMembers: string[],
    createdBy: string;
    timestamp: string;
    debts: Debt[] | undefined;
    latestEvent: EventV4 | null;
    defaultCurrency: string,
}