import { EventDTO } from "./dto/event-dto";

export default interface AddEvent {
    groupId: string;
    event: EventDTO;
}
