import Debt from "../../../interfaces/models/debt";
import { EventV2 } from "../event/event_v2";

// V2
export interface GroupV2 {
    id: string;
    name: string;
    people: string[];
    pastMembers: string[],
    createdBy: string;
    timeStamp: string;
    debts: Debt[] | undefined;
    latestEvent: EventV2 | null;
}