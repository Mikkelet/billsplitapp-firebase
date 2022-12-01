import { FriendDTO } from "./dto/friend-dto";

export interface GetFriendsRequest {
    uid: string;
}

export interface GetFriendsResponse {
    friends: FriendDTO[]
}