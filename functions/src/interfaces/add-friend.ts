import { FriendStatusDTO } from "./dto/friend-dto";

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
    userId: string;
}

export interface AddFriendResponse {
    status: FriendStatusDTO;
}