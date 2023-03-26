import { DebtDTO } from "./dto/debt-dto";
import { EventDTO } from "./dto/event-dto";

export interface DeleteEventRequest {
    groupId: string;
    event: EventDTO;
    debts: DebtDTO[];
}