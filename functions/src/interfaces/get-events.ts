import { EventDTO } from "./dto/event-dto";

export interface GetEventsRequest {
    groupId: string;
}

export interface GetEventsResponse {
    events: EventDTO[];
}
