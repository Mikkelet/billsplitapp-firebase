import { GroupDTO } from "./dto/group-dto";

export interface GetGroupRequest {
    groupId: string;
}

export interface GetGroupResponse {
    group: GroupDTO;
}