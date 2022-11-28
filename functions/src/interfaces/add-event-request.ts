import { Event } from "./models/events";

export default interface AddEvent {
    groupId: string;
    event: Event;
}
