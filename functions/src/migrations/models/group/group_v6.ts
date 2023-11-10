import { EventV4 } from "../event/event_v4";

export interface GroupV6 {
    id: string;
    name: string;
    people: string[];
    pastMembers: string[];
    coverImageUrl: string;
    createdBy: string;
    timestamp: string;
    latestEvent: EventV4 | undefined | null;
    lastUpdated: number;
    defaultCurrency: string;
}