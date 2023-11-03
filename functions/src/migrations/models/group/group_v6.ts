import { Event } from "../../../interfaces/models/events";

export interface GroupV6 {
    id: string;
    name: string;
    people: string[];
    pastMembers: string[];
    coverImageUrl: string;
    createdBy: string;
    timestamp: string;
    latestEvent: Event | undefined | null;
    lastUpdated: number;
    defaultCurrency: string;
}