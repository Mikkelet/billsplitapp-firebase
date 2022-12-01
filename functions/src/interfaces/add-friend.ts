import { FriendStatus } from "./models/friend";

export interface AddFriendRequest {
    createdBy: string;
    sentTo: string;
    timeStamp: number;
}

export interface AddFriendResponse {
    status: FriendStatus;
}