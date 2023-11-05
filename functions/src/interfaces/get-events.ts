import { EventDTO } from "./dto/event-dto";
import { ServiceDTO } from "./dto/service-dto";

export interface GetEventsRequest {
    groupId: string;
}

export interface GetEventsResponse {
    events: EventDTO[];
    services: ServiceDTO[];
}