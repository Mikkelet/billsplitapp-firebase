import { EventDTO } from "./dto/event-dto";

export default interface GetEventsResponse {
    events: EventDTO[];
}
