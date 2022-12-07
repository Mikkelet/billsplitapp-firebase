import { FriendDTO } from "./dto/friend-dto";
import { PersonDTO } from "./dto/person-dto";

export type AddFriendType = "email" | "userId"

export interface AddFriendRequest {
    type: AddFriendType;
    createdBy: string;
    timeStamp: number;
}

export interface AddFriendRequestEmail {
    type: AddFriendType;
    createdBy: string;
    timeStamp: number;
    email: string;
}

export interface AddFriendRequestUserId {
    type: AddFriendType;
    createdBy: string;
    timeStamp: number;
    user: PersonDTO;
}

export interface AddFriendResponse {
    friend: FriendDTO;
}