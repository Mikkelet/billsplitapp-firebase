import { EventDTO } from "./dto/event-dto";
import Debt from "./models/debt";

export interface AddEventRequest {
    groupId: string;
    event: EventDTO;
    debts: Debt[];
}

export interface AddEventResponse {
    event: EventDTO;
}