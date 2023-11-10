import { EventV5 } from "../event/event_v5";

export interface GroupV7 {
    id: string;
    name: string;
    people: string[];
    pastMembers: string[];
    coverImageUrl: string;
    createdBy: string;
    timestamp: string;
    latestEvent: EventV5 | undefined | null;
    lastUpdated: number;
    defaultCurrency: string;
    invites: string[];
}