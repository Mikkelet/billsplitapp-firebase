import Debt from "../../interfaces/models/debt";
import { EventV3 } from "../v3_v5/convert_events_v4_v5";

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
