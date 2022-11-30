import { EventDTO } from "./dto/event-dto";
import { GroupDTO } from "./dto/group-dto";

export default interface GetGroupResponse {
    group: GroupDTO;
    events: EventDTO[];
}