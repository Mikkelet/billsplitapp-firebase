import { EventDTO } from "./dto/event-dto";

export default interface AddEventRequest {
    groupId: string;
    event: EventDTO;
}