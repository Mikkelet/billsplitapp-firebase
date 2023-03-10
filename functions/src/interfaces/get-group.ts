import { EventDTO } from "./dto/event-dto";
import { GroupDTO } from "./dto/group-dto";
import { ServiceDTO } from "./dto/service-dto";

export interface GetGroupRequest {
    groupId: string;
}

export interface GetGroupResponse {
    group: GroupDTO;
    events: EventDTO[];
    services: ServiceDTO[];
}