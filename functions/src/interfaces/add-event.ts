import { EventDTO } from "./dto/event-dto";

export interface AddEventRequest {
    groupId: string;
    event: EventDTO;
}

export interface AddEventResponse {
    event: EventDTO;
}