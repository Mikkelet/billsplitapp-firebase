import { DebtDTO } from "./dto/debt-dto";
import { EventDTO } from "./dto/event-dto";

export interface AddEventRequest {
    event: EventDTO;
    debts: DebtDTO[];
}

export interface AddEventResponse {
    event: EventDTO;
}