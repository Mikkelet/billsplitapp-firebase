import { FriendStatus } from "./models/friend";

export interface AddFriendRequest {
    createdBy: string;
    email: string;
    timeStamp: number;
}

export interface AddFriendResponse {
    type: FriendStatus;
}