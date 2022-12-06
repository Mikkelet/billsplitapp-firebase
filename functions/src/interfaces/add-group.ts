import { GroupDTO } from "./dto/group-dto";

export interface AddGroupRequest {
    group: GroupDTO;
}

export interface AddGroupResponse {
    group: GroupDTO;
}