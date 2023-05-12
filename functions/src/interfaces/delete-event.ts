import Debt from "./models/debt";

export interface DeleteEventRequest {
    debts: Debt[];
}