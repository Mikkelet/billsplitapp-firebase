import { GroupDTO } from "./dto/group-dto";

export interface GetGroupsRequest {
    userId: string
}

export interface GetGroupsResponse {
    groups: GroupDTO[]
}