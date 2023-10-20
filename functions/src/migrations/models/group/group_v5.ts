import { EventV4 } from "../event/event_v4";

export interface GroupV5 {
    id: string;
    name: string;
    people: string[];
    pastMembers: string[];
    coverImageUrl: string;
    createdBy: string;
    timestamp: string;
    latestEvent: EventV4 | null;
    defaultCurrency: string;
}