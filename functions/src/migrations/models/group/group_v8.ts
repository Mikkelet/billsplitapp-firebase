import { EventV6 } from "../event/event_v6";

export interface GroupV8 {
    id: string;
    name: string;
    people: string[];
    pastMembers: string[];
    coverImageUrl: string;
    createdBy: string;
    timestamp: string;
    latestEvent: EventV6 | undefined | null;
    lastUpdated: number;
    defaultCurrency: string;
    invites: string[];
}